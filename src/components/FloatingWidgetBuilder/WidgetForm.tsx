
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Palette, Sparkles, Settings } from 'lucide-react';
import { WebsiteInfoForm } from './WebsiteInfoForm';
import { ChannelManager } from './ChannelManager';
import { VideoUpload } from './VideoUpload';
import { CustomizationOptions } from './CustomizationOptions';
import { TemplateSelector } from './TemplateSelector';
import { Channel, FormData } from './types';
import { TemplatePreview } from './TemplatePreview';

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
  // Show widget preview if there are channels OR if video is uploaded
  const shouldShowWidget = channels.length > 0 || Boolean(formData.video) || Boolean(formData.videoUrl) || Boolean(editingWidget?.video_url);

  return (
    <>
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-6 py-3 mb-6 bg-white/70 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
          <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
          <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Widget Builder
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {editingWidget ? 'Edit Your' : 'Customize Your'}
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Widget
          </span>
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          {editingWidget ? 'Update your website details and contact channels' : 'Add your website details and contact channels to create an engaging widget'}
        </p>
      </div>

      {/* Website Info & Channels */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-400/5"></div>
        <CardHeader className="relative z-10 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100/50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-gray-900">Setup & Configuration</span>
              <CardDescription className="text-lg mt-1">
                Configure your website details and communication channels
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8 relative z-10">
          {/* Website Info */}
          <div className="bg-white/50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Website Information
            </h3>
            <WebsiteInfoForm
              websiteName={websiteName}
              websiteUrl={websiteUrl}
              onWebsiteNameChange={onWebsiteNameChange}
              onWebsiteUrlChange={onWebsiteUrlChange}
            />
          </div>

          {/* Channel Manager */}
          <div className="bg-white/50 rounded-xl p-6 border border-gray-100">
            <ChannelManager
              channels={channels}
              onChannelsChange={onChannelsChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Design & Appearance Section */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-pink-400/5"></div>
        <CardHeader className="relative z-10 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100/50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-gray-900">Design & Appearance</span>
              <CardDescription className="text-lg mt-1">
                Customize the look and feel of your widget
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8 relative z-10">
          {/* Template Selection - Moved here from Setup section */}
          <div className="bg-white/50 rounded-xl p-6 border border-gray-100">
            <TemplateSelector
              selectedTemplateId={formData.templateId || 'default'}
              onTemplateChange={(templateId) => onFormDataChange('templateId', templateId)}
            />
          </div>

          {/* Video Upload & Icon Settings - Hide for modern-floating template */}
          {formData.templateId !== 'modern-floating' && (
            <div className="bg-white/50 rounded-xl p-6 border border-gray-100">
              <VideoUpload
                video={formData.video}
                videoUrl={formData.videoUrl || editingWidget?.video_url}
                videoType={formData.videoType}
                videoLink={formData.videoLink}
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
                onVideoTypeChange={(type) => onFormDataChange('videoType', type)}
                onVideoLinkChange={(link) => onFormDataChange('videoLink', link)}
                onVideoPreviewChange={(checked) => onFormDataChange('useVideoPreview', checked)}
                onVideoHeightChange={(height) => onFormDataChange('videoHeight', height)}
                onVideoAlignmentChange={(alignment) => onFormDataChange('videoAlignment', alignment)}
                onVideoObjectFitChange={(objectFit) => onFormDataChange('videoObjectFit', objectFit)}
                onCustomIconChange={(icon) => onFormDataChange('customIcon', icon)}
                onCustomIconUpload={onCustomIconUpload}
                onButtonSizeChange={(size) => onFormDataChange('buttonSize', size)}
                onPreviewVideoHeightChange={(height) => onFormDataChange('previewVideoHeight', height)}
              />
            </div>
          )}

          {/* Customization Options */}
          <div className="bg-white/50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Position & Messages
            </h3>
            <CustomizationOptions
              buttonColor={formData.buttonColor}
              position={formData.position}
              greetingMessage={formData.greetingMessage || ''}
              onButtonColorChange={(color) => onFormDataChange('buttonColor', color)}
              onPositionChange={(position) => onFormDataChange('position', position)}
              onGreetingMessageChange={(message) => onFormDataChange('greetingMessage', message)}
            />
          </div>

          {/* Create Button */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-gray-100 text-center">
            <Button 
              onClick={onCreateWidget} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              size="lg"
              disabled={saving || uploading}
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : uploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </div>
              ) : (
                <>
                  {editingWidget ? (
                    <>
                      <Settings className="w-5 h-5 mr-2" />
                      Update Widget
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Widget
                    </>
                  )}
                </>
              )}
            </Button>
            <p className="text-gray-600 mt-4 text-sm">
              Your widget will be ready in seconds
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Live widget preview directly on the page */}
      <TemplatePreview
        showWidget={shouldShowWidget}
        formData={formData}
        channels={channels}
        editingWidget={editingWidget}
      />
    </>
  );
};
