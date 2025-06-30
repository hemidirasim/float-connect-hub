import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Upload, Link, Users, ChevronDown, ChevronRight, Edit } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { platformOptions } from './constants';
import { Channel } from './types';
import { EditChannelModal } from './EditChannelModal';

// SortableChannelItem component for drag and drop
const SortableChannelItem = ({ channel, onEdit, onRemove, onAddChild }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: channel.id });
  const platform = platformOptions.find(p => p.value === channel.type);
  const IconComponent = platform?.icon;
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = channel.childChannels && channel.childChannels.length > 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <Card key={channel.id} className="border-l-4 border-l-blue-500" ref={setNodeRef} style={style}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            )}
            {IconComponent && <IconComponent className="w-4 h-4" style={{ color: platform?.color }} />}
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
              onClick={() => onEdit(channel)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddChild(channel.id)}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
              title="Add alt link"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(channel.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Child Channels */}
        {hasChildren && isExpanded && (
          <div className="mt-3 pl-6 space-y-2">
            {channel.childChannels.map(childChannel => (
              <div key={childChannel.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border-l-2 border-l-gray-300">
                <div className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="w-3 h-3" style={{ color: platform?.color }} />}
                  <div>
                    <span className="text-sm font-medium">{childChannel.label}</span>
                    <div className="text-xs text-gray-500">{childChannel.value}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(childChannel)}
                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                    title="Redaktə et"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(childChannel.id)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

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
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
  const [childChannelValue, setChildChannelValue] = useState('');
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance to activate
      },
    }),
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
        return 'Enter contact information...';
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
        return 'Second contact information...';
    }
  };

  const getLabelPlaceholder = () => {
    switch (selectedChannelType) {
      case 'custom':
        return 'For example: Support, Sales, etc.';
      default:
        return 'Custom name (optional)';
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
        toast.success("Icon loaded!");
      } else {
        toast.error("Icon file must be less than 1MB");
      }
    } else if (file) {
      toast.error("Upload icons in PNG, JPG, or SVG format only.");
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

  const handleEditClick = (channel: Channel) => {
    setEditingChannel(channel);
    setEditModalOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = channels.findIndex(item => item.id === active.id);
      const newIndex = channels.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newChannels = arrayMove(channels, oldIndex, newIndex);
        onChannelsChange(newChannels);
      }
    }
  };

  const handleEditChannel = (id: string, newValue: string, newLabel: string) => {
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

  // Filter only main channels for the sortable list (not child channels)
  const mainChannels = channels.filter(ch => !ch.parentId);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Contact channels
          </CardTitle>
          <CardDescription>You can add sublinks with the + button next to each channel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Channel Form */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Platform</Label>
                <Select value={selectedChannelType} onValueChange={setSelectedChannelType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose platform" />
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
                <Label>Contact info</Label>
                <Input
                  placeholder={getPlaceholderText()}
                  value={channelValue}
                  onChange={(e) => setChannelValue(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Special name (Optional)</Label>
                <Input
                  placeholder={getLabelPlaceholder()}
                  value={channelLabel}
                  onChange={(e) => setChannelLabel(e.target.value)}
                />
              </div>

              {/* Custom Icon Upload - Only show for custom links */}
              {selectedChannelType === 'custom' && (
                <div>
                  <Label>Special icon (Optional)</Label>
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
                            <span className="text-sm text-green-600">Icon uploaded</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 justify-center text-gray-500">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload icon</span>
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
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG və ya SVG (max 1MB).If you leave it blank, the default link icon will be displayed.</p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={addChannel}
              disabled={!selectedChannelType || !channelValue.trim()}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add chanell
            </Button>
          </div>

          {/* Channels List with Drag and Drop */}
          {mainChannels.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">All chanells</h3>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={mainChannels.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {mainChannels.map((channel) => (
                      <SortableChannelItem 
                        key={channel.id}
                        channel={channel}
                        onEdit={handleEditClick}
                        onRemove={removeChannel}
                        onAddChild={(id) => setAddingChildTo(id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {mainChannels.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No channels have been added yet.</p>
              <p className="text-sm">Add a channel using the form above.</p>
            </div>
          )}

          {/* Add Child Channel Form */}
          {addingChildTo && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-green-300">
              <h4 className="font-medium mb-2">Add subchannel</h4>
              <div className="flex items-center gap-2">
                <Input
                  placeholder={getChildPlaceholderText(channels.find(ch => ch.id === addingChildTo)?.type || '')}
                  value={childChannelValue}
                  onChange={(e) => setChildChannelValue(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => addChildChannel(addingChildTo)}
                  disabled={!childChannelValue.trim()}
                >
                  Add
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAddingChildTo(null);
                    setChildChannelValue('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EditChannelModal
        channel={editingChannel}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingChannel(null);
        }}
        onSave={handleEditChannel}
      />
    </>
  );
};