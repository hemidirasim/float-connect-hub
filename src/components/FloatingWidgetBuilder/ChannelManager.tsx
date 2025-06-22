
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Upload, Link, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableChannelItem } from "@/components/SortableChannelItem";
import { platformOptions } from './constants';
import { Channel } from './types';

interface ChannelManagerProps {
  channels: Channel[];
  onChannelsChange: (channels: Channel[]) => void;
}

export const ChannelManager: React.FC<ChannelManagerProps> = ({
  channels,
  onChannelsChange
}) => {
  const [selectedChannelType, setSelectedChannelType] = useState('');
  const [channelValue, setChannelValue] = useState('');
  const [channelLabel, setChannelLabel] = useState('');
  const [customIcon, setCustomIcon] = useState<File | null>(null);
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getPlaceholderText = () => {
    switch (selectedChannelType) {
      case 'whatsapp':
        return '+994501234567';
      case 'telegram':
        return '@username';
      case 'instagram':
        return 'https://instagram.com/username';
      case 'messenger':
        return 'https://m.me/username';
      case 'viber':
        return '+994501234567';
      case 'skype':
        return 'username';
      case 'discord':
        return 'https://discord.gg/invite';
      case 'tiktok':
        return '@username';
      case 'youtube':
        return '@username';
      case 'facebook':
        return 'https://facebook.com/username';
      case 'twitter':
        return '@username';
      case 'linkedin':
        return 'https://linkedin.com/in/username';
      case 'github':
        return 'https://github.com/username';
      case 'website':
        return 'https://example.com';
      case 'chatbot':
        return 'https://chat.example.com';
      case 'email':
        return 'contact@example.com';
      case 'phone':
        return '+994501234567';
      case 'custom':
        return 'https://example.com';
      default:
        return 'Əlaqə məlumatı daxil edin...';
    }
  };

  const getLabelPlaceholder = () => {
    switch (selectedChannelType) {
      case 'custom':
        return 'Məsələn: Ddestək, Satış, vb.';
      default:
        return 'Xüsusi ad (ixtiyari)';
    }
  };

  const handleCustomIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/svg+xml')) {
      if (file.size <= 1024 * 1024) { // 1MB limit
        setCustomIcon(file);
        // Create a temporary URL for preview
        const url = URL.createObjectURL(file);
        setCustomIconUrl(url);
        toast.success("Ikon yükləndi!");
      } else {
        toast.error("Ikon fayl 1MB-dan az olmalıdır");
      }
    } else if (file) {
      toast.error("Yalnız PNG, JPG və ya SVG formatında ikon yükləyin");
    }
  };

  const addChannel = () => {
    if (selectedChannelType && channelValue.trim()) {
      const platform = platformOptions.find(p => p.value === selectedChannelType);
      const newChannel: Channel = {
        id: Date.now().toString(),
        type: selectedChannelType,
        value: channelValue.trim(),
        label: channelLabel.trim() || platform?.label || 'Custom',
        displayMode: 'individual',
        // Only add customIcon if it's provided and it's a custom link
        ...(selectedChannelType === 'custom' && customIconUrl ? { customIcon: customIconUrl } : {})
      };
      
      onChannelsChange([...channels, newChannel]);
      
      // Reset form
      setChannelValue('');
      setChannelLabel('');
      setSelectedChannelType('');
      setCustomIcon(null);
      setCustomIconUrl('');
      
      toast.success(`${platform?.label || 'Kanal'} əlavə edildi!`);
    }
  };

  const removeChannel = (id: string) => {
    onChannelsChange(channels.filter(channel => channel.id !== id));
    toast.success("Kanal silindi");
  };

  const editChannel = (id: string, newValue: string, newLabel: string) => {
    onChannelsChange(channels.map(channel => 
      channel.id === id ? { 
        ...channel, 
        value: newValue,
        label: newLabel
      } : channel
    ));
    toast.success("Kanal yeniləndi");
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = channels.findIndex(item => item.id === active.id);
      const newIndex = channels.findIndex(item => item.id === over.id);
      onChannelsChange(arrayMove(channels, oldIndex, newIndex));
    }
  };

  // Group channels by type for suggestions
  const getChannelsByType = () => {
    const grouped: { [key: string]: Channel[] } = {};
    channels.filter(ch => !ch.isGroup).forEach(channel => {
      if (!grouped[channel.type]) {
        grouped[channel.type] = [];
      }  
      grouped[channel.type].push(channel);
    });
    return grouped;
  };

  const createGroupFromType = (type: string) => {
    const channelsByType = getChannelsByType();
    const typeChannels = channelsByType[type] || [];
    
    if (typeChannels.length < 2) {
      toast.error(`Qrup yaratmaq üçün ən azı 2 ədəd ${type} kanalı olmalıdır`);
      return;
    }

    const platform = platformOptions.find(p => p.value === type);
    const groupId = Date.now().toString();
    
    const newGroup: Channel = {
      id: groupId,
      type: type,
      value: '', // Empty for groups
      label: `${platform?.label || type} Qrupu`,
      isGroup: true,
      groupItems: [...typeChannels],
      displayMode: 'grouped'
    };

    // Remove individual channels and add group
    const remainingChannels = channels.filter(ch => 
      ch.type !== type || ch.isGroup
    );
    
    onChannelsChange([...remainingChannels, newGroup]);
    toast.success(`${platform?.label || type} qrupu yaradıldı!`);
  };

  const ungroupChannel = (groupId: string) => {
    const group = channels.find(ch => ch.id === groupId && ch.isGroup);
    if (!group || !group.groupItems) return;

    // Add individual items back and remove group
    const otherChannels = channels.filter(ch => ch.id !== groupId);
    const individualItems = group.groupItems.map(item => ({
      ...item,
      displayMode: 'individual' as const
    }));
    
    onChannelsChange([...otherChannels, ...individualItems]);
    toast.success('Qrup ləğv edildi');
  };

  const removeFromGroup = (groupId: string, itemId: string) => {
    const updatedChannels = channels.map(channel => {
      if (channel.id === groupId && channel.isGroup && channel.groupItems) {
        const removedItem = channel.groupItems.find(item => item.id === itemId);
        const updatedGroupItems = channel.groupItems.filter(item => item.id !== itemId);
        
        // If only one item left, ungroup entirely
        if (updatedGroupItems.length <= 1) {
          return null; // Will be filtered out
        }
        
        return {
          ...channel,
          groupItems: updatedGroupItems
        };
      }
      return channel;
    }).filter(Boolean) as Channel[];

    // Add the removed item back as individual
    const group = channels.find(ch => ch.id === groupId);
    const removedItem = group?.groupItems?.find(item => item.id === itemId);
    
    if (removedItem) {
      updatedChannels.push({
        ...removedItem,
        displayMode: 'individual'
      });
    }

    onChannelsChange(updatedChannels);
    toast.success('Kanal qrupdan çıxarıldı');
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const channelsByType = getChannelsByType();
  const groupableTypes = Object.keys(channelsByType).filter(type => 
    channelsByType[type].length >= 2
  );

  // Filter individual channels for the sortable list
  const individualChannels = channels.filter(ch => !ch.isGroup);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Əlaqə kanalları
        </CardTitle>
        <CardDescription>Kanalları qruplaşdıra və ya ayrı-ayrı istifadə edə bilərsiniz</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Channel Form */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Platform</Label>
              <Select value={selectedChannelType} onValueChange={setSelectedChannelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Platform seçin" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center gap-2">
                        <platform.icon className="w-4 h-4" style={{ color: platform.color }} />
                        {platform.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Əlaqə məlumatı</Label>
              <Input
                placeholder={getPlaceholderText()}
                value={channelValue}
                onChange={(e) => setChannelValue(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Xüsusi ad (ixtiyari)</Label>
              <Input
                placeholder={getLabelPlaceholder()}
                value={channelLabel}
                onChange={(e) => setChannelLabel(e.target.value)}
              />
            </div>

            {/* Custom Icon Upload - Only show for custom links */}
            {selectedChannelType === 'custom' && (
              <div>
                <Label>Xüsusi ikon (ixtiyari)</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleCustomIconUpload}
                    className="hidden"
                    id="custom-icon-upload"
                  />
                  <label htmlFor="custom-icon-upload" className="cursor-pointer flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-gray-400 transition-colors">
                      {customIconUrl ? (
                        <div className="flex items-center gap-2 justify-center">
                          <img src={customIconUrl} alt="Custom icon" className="w-5 h-5 object-contain" />
                          <span className="text-sm text-green-600">Ikon yükləndi</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 justify-center text-gray-500">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Ikon yükləyin</span>
                        </div>
                      )}
                    </div>
                  </label>
                  {customIconUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCustomIcon(null);
                        setCustomIconUrl('');
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG və ya SVG (max 1MB). Boş buraxsanız link ikonu göstəriləcək.</p>
              </div>
            )}
          </div>
          
          <Button 
            onClick={addChannel}
            disabled={!selectedChannelType || !channelValue.trim()}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Kanal əlavə et
          </Button>
        </div>

        {/* Group Creation Suggestions */}
        {groupableTypes.length > 0 && (
          <Card className="border-dashed border-blue-300 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Qrup Yaratma Təklifləri
              </CardTitle>
              <CardDescription className="text-xs">
                Eyni tip kanalları qruplaşdıra bilərsiniz
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {groupableTypes.map(type => {
                  const platform = platformOptions.find(p => p.value === type);
                  const count = channelsByType[type].length;
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => createGroupFromType(type)}
                      className="h-8 text-xs"
                    >
                      <platform.icon className="w-3 h-3 mr-1" style={{ color: platform.color }} />
                      {platform?.label} ({count})
                      <Users className="w-3 h-3 ml-1" />
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Channels Tree View */}
        {channels.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Bütün Kanallar</h3>
            
            {/* Groups */}
            {channels.filter(ch => ch.isGroup).map(group => {
              const platform = platformOptions.find(p => p.value === group.type);
              const isExpanded = expandedGroups.includes(group.id);
              
              return (
                <Card key={group.id} className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleGroupExpansion(group.id)}
                          className="h-6 w-6 p-0"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Button>
                        <platform.icon className="w-4 h-4" style={{ color: platform?.color }} />
                        <span className="font-medium">{group.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {group.groupItems?.length || 0} element
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => ungroupChannel(group.id)}
                        className="h-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && group.groupItems && (
                    <CardContent className="pt-0">
                      <div className="space-y-2 pl-6">
                        {group.groupItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.label}</span>
                              <span className="text-xs text-gray-500">{item.value}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromGroup(group.id, item.id)}
                              className="h-6 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}

            {/* Individual Channels */}
            {individualChannels.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={individualChannels.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {individualChannels.map((channel) => (
                      <SortableChannelItem
                        key={channel.id}
                        channel={channel}
                        onEdit={editChannel}
                        onRemove={removeChannel}
                        platformOptions={platformOptions}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}

        {channels.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Hələ heç bir kanal əlavə edilməyib</p>
            <p className="text-sm">Yuxarıdakı formu istifadə edərək kanal əlavə edin</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
