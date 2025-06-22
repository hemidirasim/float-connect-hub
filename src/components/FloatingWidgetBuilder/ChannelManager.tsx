
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Upload } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableChannelItem } from "@/components/SortableChannelItem";
import { platformOptions } from './constants';
import { Channel } from './types';
import { toast } from "sonner";

interface ChannelManagerProps {
  channels: Channel[];
  selectedChannelType: string;
  channelValue: string;
  onChannelsChange: (channels: Channel[]) => void;
  onSelectedChannelTypeChange: (type: string) => void;
  onChannelValueChange: (value: string) => void;
  onAddChannel: () => void;
  onRemoveChannel: (id: string) => void;
  onEditChannel: (id: string, newValue: string) => void;
}

export const ChannelManager: React.FC<ChannelManagerProps> = ({
  channels,
  selectedChannelType,
  channelValue,
  onChannelsChange,
  onSelectedChannelTypeChange,
  onChannelValueChange,
  onAddChannel,
  onRemoveChannel,
  onEditChannel
}) => {
  const [customIcon, setCustomIcon] = React.useState<string>('');
  const [uploadingIcon, setUploadingIcon] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = channels.findIndex(item => item.id === active.id);
      const newIndex = channels.findIndex(item => item.id === over.id);
      onChannelsChange(arrayMove(channels, oldIndex, newIndex));
    }
  };

  const handleCustomIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Icon file must be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploadingIcon(true);
    try {
      const url = URL.createObjectURL(file);
      setCustomIcon(url);
      toast.success('Custom icon uploaded!');
    } catch (error) {
      console.error('Error uploading icon:', error);
      toast.error('Failed to upload icon');
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleAddChannelWithIcon = () => {
    if (selectedChannelType === 'custom' && customIcon) {
      // Add custom icon to the channel data
      const platform = platformOptions.find(p => p.value === selectedChannelType);
      const newChannel = {
        id: Date.now().toString(),
        type: selectedChannelType,
        value: channelValue.trim(),
        label: platform?.label || selectedChannelType,
        customIcon: customIcon
      };
      onChannelsChange([...channels, newChannel]);
      onChannelValueChange('');
      onSelectedChannelTypeChange('');
      setCustomIcon('');
      toast.success('Channel added!');
    } else {
      onAddChannel();
    }
  };

  const getPlaceholderText = () => {
    switch (selectedChannelType) {
      case 'whatsapp':
      case 'viber':
        return '+994501234567';
      case 'telegram':
        return '@username';
      case 'instagram':
        return 'https://instagram.com/username';
      case 'messenger':
        return 'https://m.me/pagename';
      case 'skype':
        return 'username';
      case 'discord':
        return 'https://discord.gg/invite';
      case 'tiktok':
        return 'https://tiktok.com/@username';
      case 'youtube':
        return 'https://youtube.com/@channel';
      case 'facebook':
        return 'https://facebook.com/page';
      case 'twitter':
        return 'https://twitter.com/username';
      case 'linkedin':
        return 'https://linkedin.com/in/profile';
      case 'github':
        return 'https://github.com/username';
      case 'website':
        return 'https://example.com';
      case 'chatbot':
        return 'https://example.com/chat';
      case 'email':
        return 'contact@example.com';
      case 'custom':
        return 'https://example.com';
      default:
        return 'Enter contact info...';
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Contact Channels <span className="text-red-500">*</span></Label>
      <p className="text-sm text-gray-600">Minimum 1 contact channel must be added</p>
      
      {/* Add New Channel */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select value={selectedChannelType} onValueChange={onSelectedChannelTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-64 overflow-y-auto">
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
          
          <Input
            placeholder={getPlaceholderText()}
            value={channelValue}
            onChange={(e) => onChannelValueChange(e.target.value)}
            className="md:col-span-1"
          />
          
          <Button 
            onClick={handleAddChannelWithIcon}
            disabled={!selectedChannelType || !channelValue.trim() || (selectedChannelType === 'custom' && !customIcon)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Custom Icon Upload for Custom Links */}
        {selectedChannelType === 'custom' && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">Custom Icon (Required)</Label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomIconUpload}
                className="hidden"
                id="custom-icon-upload"
              />
              <label 
                htmlFor="custom-icon-upload" 
                className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
              >
                <Upload className="w-4 h-4" />
                {uploadingIcon ? 'Uploading...' : 'Choose Icon'}
              </label>
              {customIcon && (
                <div className="flex items-center gap-2">
                  <img src={customIcon} alt="Custom icon" className="w-8 h-8 object-contain rounded" />
                  <span className="text-sm text-green-600">Icon uploaded</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Max 2MB, PNG/JPG/SVG recommended</p>
          </div>
        )}
      </div>

      {/* Added Channels List with Drag and Drop */}
      {channels.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Added Channels (drag to reorder):</Label>
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
                    onEdit={onEditChannel}
                    onRemove={onRemoveChannel}
                    platformOptions={platformOptions}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
      
      {/* Validation message */}
      {channels.length === 0 && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
          Please add at least one contact channel to create your widget.
        </div>
      )}
    </div>
  );
};
