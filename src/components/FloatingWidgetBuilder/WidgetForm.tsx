import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import { WebsiteInfoForm } from './WebsiteInfoForm';
import { ChannelManager } from './ChannelManager';
import { VideoUpload } from './VideoUpload';
import { CustomizationOptions } from './CustomizationOptions';
import { Channel, FormData } from './types';
import { TemplateSelector } from './TemplateSelector';

interface WidgetFormProps {
  websiteName: string;
  websiteUrl: string;
  channels: Channel[];
  selectedChannelType: string;
  channelValue: string;
  formData: FormData;
  editingWidget: any;
  saving: boolean;
  uploading?: boolean;
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
  onFormDataChange: (field: string, value: string | boolean | number) => void;
  onCreateWidget: () => void;
  onCustomIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  uploading = false,
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
  onCreateWidget,
  onCustomIconUpload
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
        {/* Template Selector - New section */}
        <TemplateSelector
          selectedTemplateId={formData.templateId || ''}
          onTemplateChange={(templateId) => onFormDataChange('templateId', templateId)}
        />

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

        {/* Video Upload - Now includes all new controls */}
        <VideoUpload
          video={formData.video}
          videoUrl={formData.videoUrl || editingWidget?.video_url}
          useVideoPreview={formData.useVideoPreview}
          videoHeight={formData.videoHeight}
          videoAlignment={formData.videoAlignment}
          customIcon={formData.customIcon}
          customIconUrl={formData.customIconUrl}
          buttonSize={formData.buttonSize}
          previewVideoHeight={formData.previewVideoHeight}
          uploading={uploading}
          onVideoUpload={onVideoUpload}
          onVideoRemove={onVideoRemove}
          onVideoPreviewChange={(checked) => onFormDataChange('useVideoPreview', checked)}
          onVideoHeightChange={(height) => onFormDataChange('videoHeight', height)}
          onVideoAlignmentChange={(alignment) => onFormDataChange('videoAlignment', alignment)}
          onCustomIconChange={(icon) => onFormDataChange('customIcon', icon)}
          onCustomIconUpload={onCustomIconUpload}
          onButtonSizeChange={(size) => onFormDataChange('buttonSize', size)}
          onPreviewVideoHeightChange={(height) => onFormDataChange('previewVideoHeight', height)}
        />

        {/* Customization Options - Now includes tooltip display option */}
        <CustomizationOptions
          buttonColor={formData.buttonColor}
          position={formData.position}
          tooltip={formData.tooltip}
          tooltipDisplay={formData.tooltipDisplay}
          onButtonColorChange={(color) => onFormDataChange('buttonColor', color)}
          onPositionChange={(position) => onFormDataChange('position', position)}
          onTooltipChange={(tooltip) => onFormDataChange('tooltip', tooltip)}
          onTooltipDisplayChange={(display) => onFormDataChange('tooltipDisplay', display)}
        />

        <Button 
          onClick={onCreateWidget} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
          disabled={saving || uploading}
        >
          {saving ? 'Saving...' : uploading ? 'Uploading...' : (editingWidget ? 'Update Widget' : 'Create Widget')}
        </Button>
      </CardContent>
    </Card>
  );
};
