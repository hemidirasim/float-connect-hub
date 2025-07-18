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
    <div className="space-y-8 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 min-h-screen p-6">
      {/* Basic Info */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-b border-white/20">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Əsas məlumatlar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Widget adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Məsələn: Ana səhifə widget-i"
                className="bg-white/70 border-white/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url" className="text-sm font-semibold text-gray-700">Veb sayt URL</Label>
              <Input
                id="website_url"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="https://example.com"
                className="bg-white/70 border-white/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tooltip" className="text-sm font-semibold text-gray-700">Tooltip mətn</Label>
            <Input
              id="tooltip"
              value={formData.tooltip}
              onChange={(e) => handleInputChange('tooltip', e.target.value)}
              placeholder="Bizimlə əlaqə saxlayın!"
              className="bg-white/70 border-white/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Channels */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-white/20">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Əlaqə kanalları
          </CardTitle>
          <CardDescription className="text-gray-600">
            Kanalların sırasını sürüşdürərək dəyişə bilərsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Add Channel */}
          <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border-2 border-dashed border-purple-300/50 rounded-2xl p-6 space-y-4 hover:border-purple-400/70 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedChannelType} onValueChange={setSelectedChannelType}>
                <SelectTrigger className="bg-white/70 border-white/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300">
                  <SelectValue placeholder="Platform seç" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-white/30 rounded-xl shadow-xl">
                  {platformOptions.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value} className="rounded-lg hover:bg-purple-50/50 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-sm"
                          style={{ 
                            background: `linear-gradient(135deg, ${platform.color}, ${platform.color}80)` 
                          }}
                        >
                          <platform.icon className="w-3 h-3" />
                        </div>
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
                className="bg-white/70 border-white/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300"
              />
              
              <Button 
                onClick={addChannel}
                disabled={!selectedChannelType || !channelValue.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Əlavə et
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
                <div className="space-y-3">
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
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-600/10 to-blue-600/10 border-b border-white/20">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Görünüş ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Düymə forması</Label>
              <Select value={formData.button_style} onValueChange={(value) => handleInputChange('button_style', value)}>
                <SelectTrigger className="bg-white/70 border-white/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-white/30 rounded-xl shadow-xl">
                  {buttonStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value} className="rounded-lg hover:bg-purple-50/50 transition-colors duration-200">
                      <div className="flex items-center gap-2">
                        <style.icon className="w-4 h-4" />
                        {style.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Rəng</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.button_color}
                  onChange={(e) => handleInputChange('button_color', e.target.value)}
                  className="w-12 h-12 rounded-xl border-2 border-white/30 shadow-lg cursor-pointer transition-transform duration-200 hover:scale-110"
                />
                <Input
                  value={formData.button_color}
                  onChange={(e) => handleInputChange('button_color', e.target.value)}
                  className="flex-1 bg-white/70 border-white/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Mövqe</Label>
              <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                <SelectTrigger className="bg-white/70 border-white/30 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-white/30 rounded-xl shadow-xl">
                  <SelectItem value="left" className="rounded-lg hover:bg-purple-50/50 transition-colors duration-200">Sol</SelectItem>
                  <SelectItem value="right" className="rounded-lg hover:bg-purple-50/50 transition-colors duration-200">Sağ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Device Settings */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
            <div>
              <Label className="text-base font-semibold text-gray-800">Cihaz görünümü</Label>
              <p className="text-sm text-gray-600 mt-1">Widget-in hansı cihazlarda görünəcəyini seçin</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.show_on_mobile}
                  onCheckedChange={(checked) => handleInputChange('show_on_mobile', checked)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                />
                <Label className="font-medium text-gray-700">Mobil</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.show_on_desktop}
                  onCheckedChange={(checked) => handleInputChange('show_on_desktop', checked)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                />
                <Label className="font-medium text-gray-700">Desktop</Label>
              </div>
            </div>
          </div>

          {/* Video Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg">
              <div>
                <Label className="text-base font-semibold text-gray-800">Video yükləmə (PRO)</Label>
                <p className="text-sm text-gray-600 mt-1">Promosyon videosu əlavə edin (max 10MB)</p>
              </div>
              <Switch
                checked={formData.video_enabled}
                onCheckedChange={(checked) => handleInputChange('video_enabled', checked)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
              />
            </div>

            {formData.video_enabled && (
              <div className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 backdrop-blur-sm border-2 border-dashed border-purple-300/50 rounded-2xl p-8 text-center hover:border-purple-400/70 transition-all duration-300">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-purple-700">
                    {formData.video ? formData.video.name : 'Video yükləyin'}
                  </p>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="bg-white/70 border-white/30 backdrop-blur-sm rounded-xl hover:bg-gray-50/80 transition-all duration-300 font-semibold"
        >
          Ləğv et
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? 'Saxlanılır...' : (widget?.id ? 'Yenilə' : 'Yarat')}
        </Button>
      </div>
    </div>
  );
};
