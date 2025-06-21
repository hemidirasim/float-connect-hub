
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, ExternalLink, Phone, Mail, Send, Heart, Star, Camera, Home, User } from 'lucide-react';
import { Channel, FormData } from './types';
import { platformOptions } from './constants';

const iconMap = {
  'message-circle': MessageCircle,
  'phone': Phone,
  'mail': Mail,
  'send': Send,
  'heart': Heart,
  'star': Star,
  'camera': Camera,
  'home': Home,
  'user': User,
};

interface LivePreviewProps {
  showWidget: boolean;
  formData: FormData;
  channels: Channel[];
  videoModalOpen: boolean;
  onVideoModalOpenChange: (open: boolean) => void;
  editingWidget?: any;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  showWidget,
  formData,
  channels,
  videoModalOpen,
  onVideoModalOpenChange,
  editingWidget
}) => {
  const getChannelIcon = (type: string) => {
    const platform = platformOptions.find(p => p.value === type);
    return platform?.icon || MessageCircle;
  };

  const getChannelColor = (type: string) => {
    const platform = platformOptions.find(p => p.value === type);
    return platform?.color || '#6b7280';
  };

  const getVideoSource = () => {
    if (formData.video) {
      return URL.createObjectURL(formData.video);
    }
    if (editingWidget?.video_url) {
      return editingWidget.video_url;
    }
    return null;
  };

  const getVideoObjectPosition = () => {
    switch (formData.videoAlignment) {
      case 'top':
        return 'top';
      case 'bottom':
        return 'bottom';
      case 'center':
      default:
        return 'center';
    }
  };

  const getButtonIcon = () => {
    if (formData.customIconUrl) {
      return <img src={formData.customIconUrl} alt="Custom icon" className="w-6 h-6" />;
    }
    const IconComponent = iconMap[formData.customIcon || 'message-circle'] || MessageCircle;
    return <IconComponent className="w-6 h-6 text-white" />;
  };

  const hasVideo = formData.video || editingWidget?.video_url;

  const renderTooltipMessage = () => {
    if (!formData.tooltip || formData.tooltipDisplay === 'never') return null;
    
    if (formData.tooltipDisplay === 'always') {
      return (
        <div className={`absolute ${formData.position === 'left' ? 'left-16' : 'right-16'} bottom-2 bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap z-20`}>
          {formData.tooltip}
        </div>
      );
    }
    
    return null;
  };

  const ButtonComponent = () => (
    <button
      className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 relative overflow-hidden"
      style={{ backgroundColor: formData.buttonColor }}
    >
      {hasVideo && formData.useVideoPreview ? (
        <video
          className="w-full h-full object-cover rounded-full"
          style={{ objectPosition: getVideoObjectPosition() }}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={getVideoSource()} type="video/mp4" />
        </video>
      ) : (
        getButtonIcon()
      )}
      {renderTooltipMessage()}
    </button>
  );

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          Live Preview
        </CardTitle>
        <CardDescription>
          Real-time preview of your floating widget
        </CardDescription>
      </CardHeader>
      <CardContent className="relative min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Your website preview</p>
            <p className="text-sm">Widget appears below</p>
          </div>
        </div>
        
        {/* Live Floating Button Preview */}
        {showWidget && (
          <div 
            className={`absolute bottom-6 ${formData.position === 'left' ? 'left-6' : 'right-6'} z-10`}
          >
            {formData.tooltipDisplay === 'hover' && formData.tooltip ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Dialog open={videoModalOpen} onOpenChange={onVideoModalOpenChange}>
                      <DialogTrigger asChild>
                        <ButtonComponent />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Contact Us</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          {/* Video Section - Shows first with custom height and alignment */}
                          {hasVideo && (
                            <div className="mb-4">
                              <video
                                className="w-full rounded-lg object-cover"
                                style={{ 
                                  height: `${formData.videoHeight || 200}px`,
                                  objectPosition: getVideoObjectPosition()
                                }}
                                controls
                                autoPlay
                                playsInline
                              >
                                <source src={getVideoSource()} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                          
                          {/* Channels Grid Layout */}
                          {channels.length > 0 && (
                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                              {channels.map((channel) => {
                                const IconComponent = getChannelIcon(channel.type);
                                return (
                                  <div key={channel.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                                    <div 
                                      className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                      style={{ backgroundColor: getChannelColor(channel.type) }}
                                    >
                                      <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm">{channel.label}</p>
                                      <p className="text-xs text-gray-600 truncate">{channel.value}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {channels.length === 0 && !hasVideo && (
                            <div className="text-center py-8 text-gray-500">
                              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No contact channels added yet</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{formData.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Dialog open={videoModalOpen} onOpenChange={onVideoModalOpenChange}>
                <DialogTrigger asChild>
                  <ButtonComponent />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Contact Us</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {/* Video Section - Shows first with custom height and alignment */}
                    {hasVideo && (
                      <div className="mb-4">
                        <video
                          className="w-full rounded-lg object-cover"
                          style={{ 
                            height: `${formData.videoHeight || 200}px`,
                            objectPosition: getVideoObjectPosition()
                          }}
                          controls
                          autoPlay
                          playsInline
                        >
                          <source src={getVideoSource()} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                    
                    {/* Channels Grid Layout */}
                    {channels.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                        {channels.map((channel) => {
                          const IconComponent = getChannelIcon(channel.type);
                          return (
                            <div key={channel.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                style={{ backgroundColor: getChannelColor(channel.type) }}
                              >
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{channel.label}</p>
                                <p className="text-xs text-gray-600 truncate">{channel.value}</p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {channels.length === 0 && !hasVideo && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No contact channels added yet</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
