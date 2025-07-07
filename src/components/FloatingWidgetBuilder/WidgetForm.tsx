
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Palette } from 'lucide-react';
import { WebsiteInfoForm } from './WebsiteInfoForm';
import { ChannelManager } from './ChannelManager';
import { VideoUpload } from './VideoUpload';
import { CustomizationOptions } from './CustomizationOptions';
import { LiveChatSettings } from './LiveChatSettings';
import { Channel, FormData } from './types';
import { TemplatePreview } from './TemplatePreview';
import { WidgetPreviewButton } from './WidgetPreviewButton';

interface WidgetFormProps {
  websiteName: string;
  websiteUrl: string;
  channels: Channel[];
  formData: FormData;
  editingWidget: any;
  saving: boolean;
  uploading?: boolean;
  onWebsiteNameChange: (value: string) => void;
  onWebsiteUrlChange: (value: string) => void;
  onChannelsChange: (channels: Channel[]) => void;
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
  formData,
  editingWidget,
  saving,
  uploading = false,
  onWebsiteNameChange,
  onWebsiteUrlChange,
  onChannelsChange,
  onVideoUpload,
  onVideoRemove,
  onFormDataChange,
  onCreateWidget,
  onCustomIconUpload
}) => {
  const [previewOpen, setPreviewOpen] = React.useState(false);

  return (
    <>
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
            onChannelsChange={onChannelsChange}
          />
        </CardContent>
      </Card>

      {/* Design & Appearance Section */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            Design & Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your widget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Live Chat Settings */}
          <LiveChatSettings
            liveChatEnabled={formData.liveChatEnabled}
            liveChatGreeting={formData.liveChatGreeting}
            liveChatColor={formData.liveChatColor}
            liveChatAutoOpen={formData.liveChatAutoOpen}
            liveChatOfflineMessage={formData.liveChatOfflineMessage}
            liveChatAgentName={formData.liveChatAgentName}
            onLiveChatEnabledChange={(enabled) => onFormDataChange('liveChatEnabled', enabled)}
            onLiveChatGreetingChange={(greeting) => onFormDataChange('liveChatGreeting', greeting)}
            onLiveChatColorChange={(color) => onFormDataChange('liveChatColor', color)}
            onLiveChatAutoOpenChange={(autoOpen) => onFormDataChange('liveChatAutoOpen', autoOpen)}
            onLiveChatOfflineMessageChange={(message) => onFormDataChange('liveChatOfflineMessage', message)}
            onLiveChatAgentNameChange={(name) => onFormDataChange('liveChatAgentName', name)}
          />

          {/* Video Upload & Icon Settings */}
          <VideoUpload
            video={formData.video}
            videoUrl={formData.videoUrl || editingWidget?.video_url}
            useVideoPreview={formData.useVideoPreview}
            videoHeight={formData.videoHeight}
            videoAlignment={formData.videoAlignment}
            videoObjectFit={formData.videoObjectFit}
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
            onVideoObjectFitChange={(objectFit) => onFormDataChange('videoObjectFit', objectFit)}
            onCustomIconChange={(icon) => onFormDataChange('customIcon', icon)}
            onCustomIconUpload={onCustomIconUpload}
            onButtonSizeChange={(size) => onFormDataChange('buttonSize', size)}
            onPreviewVideoHeightChange={(height) => onFormDataChange('previewVideoHeight', height)}
          />

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Position & Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomizationOptions
                buttonColor={formData.buttonColor}
                position={formData.position}
                tooltip={formData.tooltip}
                tooltipDisplay={formData.tooltipDisplay}
                tooltipPosition={formData.tooltipPosition || 'top'}
                greetingMessage={formData.greetingMessage || 'Hello! How can we help you today?'}
                onButtonColorChange={(color) => onFormDataChange('buttonColor', color)}
                onPositionChange={(position) => onFormDataChange('position', position)}
                onTooltipChange={(tooltip) => onFormDataChange('tooltip', tooltip)}
                onTooltipDisplayChange={(display) => onFormDataChange('tooltipDisplay', display)}
                onTooltipPositionChange={(position) => onFormDataChange('tooltipPosition', position)}
                onGreetingMessageChange={(message) => onFormDataChange('greetingMessage', message)}
              />
            </CardContent>
          </Card>

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

      {/* Widget Preview Modal */}
      <TemplatePreview
        showWidget={previewOpen}
        formData={formData}
        channels={channels}
        editingWidget={editingWidget}
      />

      {/* Separate Fixed Widget Button */}
      <WidgetPreviewButton
        formData={formData}
        showWidget={channels.length > 0 || formData.liveChatEnabled}
        onButtonClick={() => setPreviewOpen(true)}
      />
    </>
  );
};
