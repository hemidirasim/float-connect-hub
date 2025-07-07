import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, Upload, Circle, Square, Heart, Star, MessageCircle, Mail, Phone, Instagram, Send } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableChannelItem } from "@/components/SortableChannelItem";

interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
}

interface Widget {
  id?: string;
  name: string;
  website_url: string;
  button_color: string;
  position: string;
  tooltip: string;
  video_enabled: boolean;
  button_style: string;
  custom_icon_url: string;
  show_on_mobile: boolean;
  show_on_desktop: boolean;
  channels: Channel[];
  video?: File | null;
}

interface WidgetCreatorProps {
  widget?: Widget | null;
  onSave: () => void;
  onCancel: () => void;
}

const platformOptions = [
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25d366' },
  { value: 'telegram', label: 'Telegram', icon: Send, color: '#0088cc' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: '#e4405f' },
  { value: 'email', label: 'Email', icon: Mail, color: '#ea4335' },
  { value: 'phone', label: 'Telefon', icon: Phone, color: '#22c55e' },
];

const buttonStyles = [
  { value: 'circle', label: 'Dairə', icon: Circle },
  { value: 'square', label: 'Kvadrat', icon: Square },
  { value: 'heart', label: 'Ürək', icon: Heart },
  { value: 'star', label: 'Ulduz', icon: Star },
];

export const WidgetCreator: React.FC<WidgetCreatorProps> = ({ widget, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Widget>({
    name: widget?.name || 'My Widget',
    website_url: widget?.website_url || '',
    button_color: widget?.button_color || '#25d366',
    position: widget?.position || 'right',
    tooltip: widget?.tooltip || '',
    video_enabled: widget?.video_enabled || false,
    button_style: widget?.button_style || 'circle',
    custom_icon_url: widget?.custom_icon_url || '',
    show_on_mobile: widget?.show_on_mobile !== false,
    show_on_desktop: widget?.show_on_desktop !== false,
    channels: widget?.channels || [],
    video: null
  });

  const [channels, setChannels] = useState<Channel[]>(widget?.channels || []);
  const [selectedChannelType, setSelectedChannelType] = useState('');
  const [channelValue, setChannelValue] = useState('');
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addChannel = () => {
    if (selectedChannelType && channelValue.trim()) {
      const platform = platformOptions.find(p => p.value === selectedChannelType);
      const newChannel: Channel = {
        id: Date.now().toString(),
        type: selectedChannelType,
        value: channelValue.trim(),
        label: platform?.label || 'Custom'
      };
      setChannels(prev => [...prev, newChannel]);
      setChannelValue('');
      setSelectedChannelType('');
      toast.success(`${platform?.label || 'Kanal'} əlavə edildi!`);
    }
  };

  const removeChannel = (id: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
    toast.success("Kanal silindi");
  };

  // Fix the editChannel function to properly handle both value and label
  const editChannel = (id: string, newValue: string, newLabel: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === id ? { 
        ...channel, 
        value: newValue,
        label: newLabel // Make sure to update the label as well
      } : channel
    ));
    toast.success("Kanal yeniləndi");
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setChannels((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFormData(prev => ({
        ...prev,
        video: file
      }));
      toast.success("Video yükləndi!");
    } else if (file) {
      toast.error("Video fayl 10MB-dan az olmalıdır");
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.website_url.trim()) {
      toast.error('Ad və veb sayt URL-i tələb olunur');
      return;
    }

    if (channels.length === 0) {
      toast.error('Ən azı bir kanal əlavə edin');
      return;
    }

    setLoading(true);
    try {
      const widgetData = {
        ...formData,
        channels: channels, // Make sure channels with updated labels are saved
        updated_at: new Date().toISOString()
      };

      console.log('Saving widget with channels:', channels); // Debug log

      if (widget?.id) {
        // Update existing widget
        const { error } = await supabase
          .from('widgets')
          .update(widgetData)
          .eq('id', widget.id);

        if (error) throw error;
        toast.success('Widget yeniləndi!');
      } else {
        // Create new widget
        const { error } = await supabase
          .from('widgets')
          .insert([widgetData]);

        if (error) throw error;
        toast.success('Widget yaradıldı!');
      }

      onSave();
    } catch (error) {
      console.error('Error saving widget:', error);
      toast.error('Widget saxlanılarkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholderText = () => {
    switch (selectedChannelType) {
      case 'whatsapp':
      case 'phone':
        return '+994501234567';
      case 'telegram':
        return '@username';
      case 'instagram':
        return 'https://instagram.com/username';
      case 'email':
        return 'contact@example.com';
      default:
        return 'Əlaqə məlumatı daxil edin...';
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Əsas məlumatlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Widget adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Məsələn: Ana səhifə widget-i"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">Veb sayt URL</Label>
              <Input
                id="website_url"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tooltip">Tooltip mətn</Label>
            <Input
              id="tooltip"
              value={formData.tooltip}
              onChange={(e) => handleInputChange('tooltip', e.target.value)}
              placeholder="Bizimlə əlaqə saxlayın!"
            />
          </div>
        </CardContent>
      </Card>

      {/* Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Communication channels</CardTitle>
          <CardDescription>You can change the order of channels by sliding them.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Channel */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              
              <Input
                placeholder={getPlaceholderText()}
                value={channelValue}
                onChange={(e) => setChannelValue(e.target.value)}
              />
              
              <Button 
                onClick={addChannel}
                disabled={!selectedChannelType || !channelValue.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
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
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.button_color}
                  onChange={(e) => handleInputChange('button_color', e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={formData.button_color}
                  onChange={(e) => handleInputChange('button_color', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Position</Label>
              <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Device Settings */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="text-base">Cihaz görünümü</Label>
              <p className="text-sm text-gray-600">Widget-in hansı cihazlarda görünəcəyini seçin</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.show_on_mobile}
                  onCheckedChange={(checked) => handleInputChange('show_on_mobile', checked)}
                />
                <Label>Mobil</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.show_on_desktop}
                  onCheckedChange={(checked) => handleInputChange('show_on_desktop', checked)}
                />
                <Label>Desktop</Label>
              </div>
            </div>
          </div>

          {/* Video Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Video yükləmə (PRO)</Label>
                <p className="text-sm text-gray-600">Promosyon videosu əlavə edin (max 10MB)</p>
              </div>
              <Switch
                checked={formData.video_enabled}
                onCheckedChange={(checked) => handleInputChange('video_enabled', checked)}
              />
            </div>

            {formData.video_enabled && (
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-purple-50/50">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Upload className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-700 font-medium">
                    {formData.video ? formData.video.name : 'Video yükləyin'}
                  </p>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Ləğv et
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saxlanılır...' : (widget?.id ? 'Yenilə' : 'Yarat')}
        </Button>
      </div>
    </div>
  );
};
