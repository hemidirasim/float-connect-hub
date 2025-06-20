
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import { WebsiteInfoForm } from './WebsiteInfoForm';
import { ChannelManager } from './ChannelManager';
import { VideoUpload } from './VideoUpload';
import { CustomizationOptions } from './CustomizationOptions';
import { Channel, FormData } from './types';

interface WidgetFormProps {
  websiteName: string;
  websiteUrl: string;
  channels: Channel[];
  selectedChannelType: string;
  channelValue: string;
  formData: FormData;
  editingWidget: any;
  saving: boolean;
  onWebsiteNameChange: (value: string) => void;
  onWebsiteUrlChange: (value: string) => void;
  onChannelsChange: (channels: Channel[]) => void;
  onSelectedChannelTypeChange: (type: string) => void;
  onChannelValueChange: (value: string) => void;
  onAddChannel: () => void;
  onRemoveChannel: (id: string) => void;
  onEditChannel: (id: string, newValue: string) => void;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoRemove: () => void;
  onFormDataChange: (field: string, value: string | boolean) => void;
  onCreateWidget: () => void;
}

export const WidgetForm: React.FC<WidgetFormProps> = ({
  websiteName,
  websiteUrl,
  channels,
  selectedChannelType,
  channelValue,
  formData,
  editingWidget,
  saving,
  onWebsiteNameChange,
  onWebsiteUrlChange,
  onChannelsChange,
  onSelectedChannelTypeChange,
  onChannelValueChange,
  onAddChannel,
  onRemoveChannel,
  onEditChannel,
  onVideoUpload,
  onVideoRemove,
  onFormDataChange,
  onCreateWidget
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          {editingWidget ? 'Edit Your Widget' : 'Customize Your Widget'}
        </CardTitle>
        <CardDescription>
          {editingWidget ? 'Update your website details and contact channels' : 'Add your website details and contact channels'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Website Info */}
        <WebsiteInfoForm
          websiteName={websiteName}
          websiteUrl={websiteUrl}
          onWebsiteNameChange={onWebsiteNameChange}
          onWebsiteUrlChange={onWebsiteUrlChange}
        />

        {/* Channel Manager */}
        <ChannelManager
          channels={channels}
          selectedChannelType={selectedChannelType}
          channelValue={channelValue}
          onChannelsChange={onChannelsChange}
          onSelectedChannelTypeChange={onSelectedChannelTypeChange}
          onChannelValueChange={onChannelValueChange}
          onAddChannel={onAddChannel}
          onRemoveChannel={onRemoveChannel}
          onEditChannel={onEditChannel}
        />

        {/* Video Upload */}
        <VideoUpload
          video={formData.video}
          videoUrl={editingWidget?.video_url}
          useVideoPreview={formData.useVideoPreview}
          onVideoUpload={onVideoUpload}
          onVideoRemove={onVideoRemove}
          onVideoPreviewChange={(checked) => onFormDataChange('useVideoPreview', checked)}
        />

        {/* Customization Options */}
        <CustomizationOptions
          buttonColor={formData.buttonColor}
          position={formData.position}
          tooltip={formData.tooltip}
          onButtonColorChange={(color) => onFormDataChange('buttonColor', color)}
          onPositionChange={(position) => onFormDataChange('position', position)}
          onTooltipChange={(tooltip) => onFormDataChange('tooltip', tooltip)}
        />

        <Button 
          onClick={onCreateWidget} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
          disabled={saving}
        >
          {saving ? 'Saving...' : (editingWidget ? 'Update Widget' : 'Create Widget')}
        </Button>
      </CardContent>
    </Card>
  );
};
