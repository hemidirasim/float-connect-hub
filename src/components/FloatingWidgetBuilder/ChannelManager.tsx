
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Upload, Link } from 'lucide-react';
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

  // Fix editChannel to handle both value and label
  const editChannel = (id: string, newValue: string, newLabel: string) => {
    onChannelsChange(channels.map(channel => 
      channel.id === id ? { 
        ...channel, 
        value: newValue,
        label: newLabel // Update both value and label
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Əlaqə kanalları</CardTitle>
        <CardDescription>Kanalları sürüşdürərək sırasını dəyişə bilərsiniz</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {/* Channels List */}
        {channels.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={channels.map(c => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {channels.map((channel) => (
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
