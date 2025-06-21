
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Eye } from 'lucide-react';
import { WebsiteInfoForm } from './WebsiteInfoForm';
import { ChannelManager } from './ChannelManager';
import { VideoUpload } from './VideoUpload';
import { CustomizationOptions } from './CustomizationOptions';
import { Channel, FormData } from './types';
import { TemplateSelector } from './TemplateSelector';
import { TemplatePreview } from './TemplatePreview';

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
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  return (
    <>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              {editingWidget ? 'Edit Your Widget' : 'Customize Your Widget'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewModalOpen(true)}
              disabled={channels.length === 0}
              className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </CardTitle>
          <CardDescription>
            {editingWidget ? 'Update your website details and contact channels' : 'Add your website details and contact channels'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selector */}
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

          {/* Video Upload */}
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

          {/* Customization Options */}
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

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Widget Preview - Real-time
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <TemplatePreview
              showWidget={channels.length > 0}
              formData={formData}
              channels={channels}
              editingWidget={editingWidget}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
