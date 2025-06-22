
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
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
  const [childChannelValue, setChildChannelValue] = useState('');

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

  const getChildPlaceholderText = (channelType: string) => {
    switch (channelType) {
      case 'whatsapp':
        return '+994501234567';
      case 'telegram':
        return '@username2';
      case 'instagram':
        return 'https://instagram.com/username2';
      case 'messenger':
        return 'https://m.me/username2';
      case 'viber':
        return '+994501234568';
      case 'skype':
        return 'username2';
      case 'discord':
        return 'https://discord.gg/invite2';
      case 'tiktok':
        return '@username2';
      case 'youtube':
        return '@username2';
      case 'facebook':
        return 'https://facebook.com/username2';
      case 'twitter':
        return '@username2';
      case 'linkedin':
        return 'https://linkedin.com/in/username2';
      case 'github':
        return 'https://github.com/username2';
      case 'website':
        return 'https://example2.com';
      case 'chatbot':
        return 'https://chat2.example.com';
      case 'email':
        return 'contact2@example.com';
      case 'phone':
        return '+994501234568';
      case 'custom':
        return 'https://example2.com';
      default:
        return 'İkinci əlaqə məlumatı...';
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
        childChannels: [],
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

  const addChildChannel = (parentId: string) => {
    if (!childChannelValue.trim()) return;

    const parentChannel = channels.find(ch => ch.id === parentId);
    if (!parentChannel) return;

    const platform = platformOptions.find(p => p.value === parentChannel.type);
    const newChildChannel: Channel = {
      id: Date.now().toString(),
      type: parentChannel.type,
      value: childChannelValue.trim(),
      label: `${platform?.label || parentChannel.type} #${(parentChannel.childChannels?.length || 0) + 2}`,
      displayMode: 'individual',
      parentId: parentId
    };

    const updatedChannels = channels.map(channel => {
      if (channel.id === parentId) {
        return {
          ...channel,
          childChannels: [...(channel.childChannels || []), newChildChannel]
        };
      }
      return channel;
    });

    onChannelsChange(updatedChannels);
    setChildChannelValue('');
    setAddingChildTo(null);
    toast.success(`${platform?.label || 'Alt kanal'} əlavə edildi!`);
  };

  const removeChannel = (id: string) => {
    // Check if it's a child channel
    const parentChannel = channels.find(ch => ch.childChannels?.some(child => child.id === id));
    
    if (parentChannel) {
      // Remove child channel
      const updatedChannels = channels.map(channel => {
        if (channel.id === parentChannel.id) {
          return {
            ...channel,
            childChannels: channel.childChannels?.filter(child => child.id !== id) || []
          };
        }
        return channel;
      });
      onChannelsChange(updatedChannels);
    } else {
      // Remove main channel
      onChannelsChange(channels.filter(channel => channel.id !== id));
    }
    
    toast.success("Kanal silindi");
  };

  const editChannel = (id: string, newValue: string, newLabel: string) => {
    // Check if it's a child channel
    const parentChannel = channels.find(ch => ch.childChannels?.some(child => child.id === id));
    
    if (parentChannel) {
      // Edit child channel
      const updatedChannels = channels.map(channel => {
        if (channel.id === parentChannel.id) {
          return {
            ...channel,
            childChannels: channel.childChannels?.map(child => 
              child.id === id ? { ...child, value: newValue, label: newLabel } : child
            ) || []
          };
        }
        return channel;
      });
      onChannelsChange(updatedChannels);
    } else {
      // Edit main channel
      onChannelsChange(channels.map(channel => 
        channel.id === id ? { 
          ...channel, 
          value: newValue,
          label: newLabel
        } : channel
      ));
    }
    
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

  const toggleChannelExpansion = (channelId: string) => {
    setExpandedGroups(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  // Filter only main channels for the sortable list (not child channels)
  const mainChannels = channels.filter(ch => !ch.parentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Əlaqə kanalları
        </CardTitle>
        <CardDescription>Hər kanalın yanındakı + düyməsi ilə alt linklər əlavə edə bilərsiniz</CardDescription>
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

        {/* Channels Tree View */}
        {mainChannels.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Bütün Kanallar</h3>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={mainChannels.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {mainChannels.map((channel) => {
                    const platform = platformOptions.find(p => p.value === channel.type);
                    const isExpanded = expandedGroups.includes(channel.id);
                    const hasChildren = channel.childChannels && channel.childChannels.length > 0;
                    
                    return (
                      <Card key={channel.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                              {hasChildren && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleChannelExpansion(channel.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </Button>
                              )}
                              <platform.icon className="w-4 h-4" style={{ color: platform?.color }} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{channel.label}</span>
                                  {hasChildren && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{channel.childChannels.length}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">{channel.value}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setAddingChildTo(channel.id)}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                title="Alt link əlavə et"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeChannel(channel.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Add Child Channel Form */}
                          {addingChildTo === channel.id && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-green-300">
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder={getChildPlaceholderText(channel.type)}
                                  value={childChannelValue}
                                  onChange={(e) => setChildChannelValue(e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => addChildChannel(channel.id)}
                                  disabled={!childChannelValue.trim()}
                                >
                                  Əlavə et
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setAddingChildTo(null);
                                    setChildChannelValue('');
                                  }}
                                >
                                  Ləğv et
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Child Channels */}
                          {hasChildren && isExpanded && (
                            <div className="mt-3 pl-6 space-y-2">
                              {channel.childChannels.map(childChannel => (
                                <div key={childChannel.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border-l-2 border-l-gray-300">
                                  <div className="flex items-center gap-2">
                                    <platform.icon className="w-3 h-3" style={{ color: platform?.color }} />
                                    <div>
                                      <span className="text-sm font-medium">{childChannel.label}</span>
                                      <div className="text-xs text-gray-500">{childChannel.value}</div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeChannel(childChannel.id)}
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {mainChannels.length === 0 && (
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
