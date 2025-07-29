
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VideoUpload } from './VideoUpload';
import { ChannelManager } from './ChannelManager';
import { CustomizationOptions } from './CustomizationOptions';
import { TemplateSelector } from './TemplateSelector';
import { CodePreview } from './CodePreview';
import type { Channel, WidgetConfig } from './types';
import { templates } from './constants';

interface WidgetFormProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  websiteName: string;
  websiteUrl: string;
  channels: Channel[];
  formData: any;
  editingWidget: any;
  saving: boolean;
  uploading: boolean;
  onWebsiteNameChange: (name: string) => void;
  onWebsiteUrlChange: (url: string) => void;
  onChannelsChange: (channels: Channel[]) => void;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoRemove: () => void;
  onFormDataChange: (field: string, value: any) => void;
  onCreateWidget: () => void;
  onCustomIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WidgetForm: React.FC<WidgetFormProps> = ({
  selectedTemplate,
  onTemplateChange,
  websiteName,
  websiteUrl,
  channels,
  formData,
  editingWidget,
  saving,
  uploading,
  onWebsiteNameChange,
  onWebsiteUrlChange,
  onChannelsChange,
  onVideoUpload,
  onVideoRemove,
  onFormDataChange,
  onCreateWidget,
  onCustomIconUpload
}) => {
  const [widgetName, setWidgetName] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('Salam! Sizə necə kömək edə bilərəm?');
  const [buttonColor, setButtonColor] = useState('#22c55e');
  const [position, setPosition] = useState<'left' | 'right'>('right');
  const [tooltipText, setTooltipText] = useState('Bizimlə əlaqə saxlayın');
  const [tooltipDisplay, setTooltipDisplay] = useState<'hover' | 'always' | 'never'>('hover');
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('left');
  
  // Video states - only relevant for supported templates
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<'upload' | 'link'>('upload');
  const [videoLink, setVideoLink] = useState<string>('');
  const [useVideoPreview, setUseVideoPreview] = useState(false);
  const [videoHeight, setVideoHeight] = useState(300);
  const [videoAlignment, setVideoAlignment] = useState('center');
  const [videoObjectFit, setVideoObjectFit] = useState('cover');
  const [previewVideoHeight, setPreviewVideoHeight] = useState(120);
  
  // UI states
  const [customIcon, setCustomIcon] = useState<string>('message');
  const [customIconUrl, setCustomIconUrl] = useState<string>('');
  const [buttonSize, setButtonSize] = useState(60);

  // Check if current template supports video
  const isVideoSupported = selectedTemplate !== 'modern-floating';

  // Clear video data when switching to non-video templates
  useEffect(() => {
    if (!isVideoSupported) {
      setVideo(null);
      setVideoUrl(null);
      setVideoLink('');
      setUseVideoPreview(false);
    }
  }, [selectedTemplate, isVideoSupported]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isVideoSupported) return;

    try {
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(`${widgetName}/${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Video upload error:', error);
        toast.error('Video yüklənərkən xəta baş verdi');
        return;
      }

      const videoUrl = supabase.storage.from('videos').getPublicUrl(data.path).data.publicUrl;
      setVideoUrl(videoUrl);
      setVideo(file);
      toast.success('Video uğurla yükləndi!');
    } catch (error) {
      console.error('Unexpected video upload error:', error);
      toast.error('Gözlənilməyən xəta baş verdi');
    }
  };

  const handleVideoRemove = async () => {
    if (!isVideoSupported) return;
    
    try {
      if (videoUrl) {
        const filePath = videoUrl.replace(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/`, '');
        const { error } = await supabase.storage
          .from('videos')
          .remove([filePath]);

        if (error) {
          console.error('Video remove error:', error);
          toast.error('Video silinərkən xəta baş verdi');
          return;
        }
      }

      setVideo(null);
      setVideoUrl(null);
      toast.success('Video uğurla silindi!');
    } catch (error) {
      console.error('Unexpected video remove error:', error);
      toast.error('Gözlənilməyən xəta baş verdi');
    }
  };

  const handleSave = async () => {
    if (!widgetName.trim()) {
      toast.error('Widget adı tələb olunur');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Giriş etməlisiniz');
        return;
      }

      const widgetData = {
        user_id: user.id,
        name: widgetName,
        template_id: selectedTemplate,
        greeting_message: greetingMessage,
        channels,
        button_color: buttonColor,
        position,
        tooltip_text: tooltipText,
        tooltip_display: tooltipDisplay,
        tooltip_position: tooltipPosition,
        custom_icon: customIcon === 'custom' ? customIconUrl : customIcon,
        button_size: buttonSize,
        // Only include video data for supported templates
        ...(isVideoSupported && {
          video_enabled: !!(video || videoLink),
          video_url: videoUrl || videoLink || null,
          video_height: videoHeight,
          video_alignment: videoAlignment,
          video_object_fit: videoObjectFit,
          use_video_preview: useVideoPreview,
          preview_video_height: previewVideoHeight
        })
      };

      const { error } = await supabase
        .from('widgets')
        .insert([widgetData]);

      if (error) throw error;

      toast.success('Widget uğurla yaradıldı!');
      
      // Reset form
      setWidgetName('');
      onChannelsChange([]);
      if (isVideoSupported) {
        setVideo(null);
        setVideoUrl(null);
        setVideoLink('');
        setUseVideoPreview(false);
      }
      setCustomIcon('message');
      setCustomIconUrl('');
    } catch (error) {
      console.error('Error saving widget:', error);
      toast.error('Widget saxlanılarkən xəta baş verdi');
    }
  };

  return (
    <div className="space-y-6">
      <TemplateSelector
        selectedTemplateId={selectedTemplate}
        onTemplateChange={onTemplateChange}
      />

      <Card>
        <CardHeader>
          <CardTitle>Widget Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="widget-name">Widget Name</Label>
            <Input
              id="widget-name"
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
              placeholder="My Contact Widget"
            />
          </div>

          <div>
            <Label htmlFor="greeting">Greeting Message</Label>
            <Textarea
              id="greeting"
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
              placeholder="Salam! Sizə necə kömək edə bilərəm?"
            />
          </div>
        </CardContent>
      </Card>

      {isVideoSupported && (
        <VideoUpload
          video={video}
          videoUrl={videoUrl}
          videoType={videoType}
          videoLink={videoLink}
          useVideoPreview={useVideoPreview}
          videoHeight={videoHeight}
          videoAlignment={videoAlignment}
          videoObjectFit={videoObjectFit}
          customIcon={customIcon}
          customIconUrl={customIconUrl}
          buttonSize={buttonSize}
          previewVideoHeight={previewVideoHeight}
          uploading={uploading}
          selectedTemplate={selectedTemplate}
          onVideoUpload={handleVideoUpload}
          onVideoRemove={handleVideoRemove}
          onVideoTypeChange={setVideoType}
          onVideoLinkChange={setVideoLink}
          onVideoPreviewChange={setUseVideoPreview}
          onVideoHeightChange={setVideoHeight}
          onVideoAlignmentChange={setVideoAlignment}
          onVideoObjectFitChange={setVideoObjectFit}
          onCustomIconChange={setCustomIcon}
          onCustomIconUpload={onCustomIconUpload}
          onButtonSizeChange={setButtonSize}
          onPreviewVideoHeightChange={setPreviewVideoHeight}
        />
      )}

      <ChannelManager
        channels={channels}
        onChannelsChange={onChannelsChange}
      />

      <CustomizationOptions
        buttonColor={buttonColor}
        position={position}
        tooltipText={tooltipText}
        tooltipDisplay={tooltipDisplay}
        tooltipPosition={tooltipPosition}
        onButtonColorChange={setButtonColor}
        onPositionChange={(pos) => setPosition(pos as 'left' | 'right')}
        onTooltipTextChange={setTooltipText}
        onTooltipDisplayChange={setTooltipDisplay}
        onTooltipPositionChange={setTooltipPosition}
      />

      <Button
        onClick={handleSave}
        disabled={!widgetName.trim()}
        className="w-full"
      >
        {saving ? 'Saxlanılır...' : 'Widget Yarat'}
      </Button>
    </div>
  );
};
