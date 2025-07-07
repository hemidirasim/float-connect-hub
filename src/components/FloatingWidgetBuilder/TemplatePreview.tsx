import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Phone, Mail, Send, Instagram, Zap, Globe, Users, Heart, Star, Square, Circle, X, Minus } from 'lucide-react';
import { Channel, FormData } from './types';

interface TemplatePreviewProps {
  showWidget: boolean;
  formData: FormData;
  channels: Channel[];
  editingWidget?: any;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  showWidget,
  formData,
  channels,
  editingWidget
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{text: string, isUser: boolean, time: string}>>([]);
  const [chatInput, setChatInput] = useState('');

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
      case 'telegram':
        return MessageCircle;
      case 'phone':
        return Phone;
      case 'email':
        return Mail;
      case 'instagram':
        return Instagram;
      default:
        return MessageCircle;
    }
  };

  const getChannelColor = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return '#25d366';
      case 'telegram':
        return '#0088cc';
      case 'phone':
        return '#22c55e';
      case 'email':
        return '#ea4335';
      case 'instagram':
        return '#e4405f';
      default:
        return formData.buttonColor;
    }
  };

  const handleChannelClick = (channel: Channel) => {
    let url = '';
    switch (channel.type) {
      case 'whatsapp':
        url = `https://wa.me/${channel.value}`;
        break;
      case 'telegram':
        url = `https://t.me/${channel.value}`;
        break;
      case 'instagram':
        url = channel.value.startsWith('http') ? channel.value : `https://instagram.com/${channel.value}`;
        break;
      case 'email':
        url = `mailto:${channel.value}`;
        break;
      case 'phone':
        url = `tel:${channel.value}`;
        break;
      default:
        url = channel.value;
    }
    window.open(url, '_blank');
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage = {
        text: chatInput,
        isUser: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatInput('');
      
      // Simulate agent response
      setTimeout(() => {
        const agentMessage = {
          text: "Thanks for your message! We'll get back to you soon.",
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, agentMessage]);
      }, 1000);
    }
  };

  const handleStartLiveChat = () => {
    setIsOpen(false);
    setLiveChatOpen(true);
    if (chatMessages.length === 0) {
      setChatMessages([{
        text: formData.liveChatGreeting,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  // Show widget if there are channels OR live chat is enabled
  const shouldShowWidget = showWidget && (channels.length > 0 || formData.liveChatEnabled);

  if (!shouldShowWidget) {
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-center">
        <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Add channels or enable live chat to see preview
        </p>
      </div>
    );
  }

  const buttonSize = formData.buttonSize || 60;
  const position = formData.position === 'left' ? 'left-4' : 'right-4';

  return (
    <>
      {/* Live Chat Modal */}
      {liveChatOpen && formData.liveChatEnabled && (
        <div 
          className={`fixed bottom-20 ${position} w-80 h-96 bg-white rounded-lg shadow-xl border z-50`}
          style={{ position: 'fixed', zIndex: 9999 }}
        >
          {/* Chat Header */}
          <div 
            className="flex items-center justify-between p-3 rounded-t-lg text-white"
            style={{ backgroundColor: formData.liveChatColor }}
          >
            <div className="font-semibold">
              {formData.liveChatAgentName ? `Chat with ${formData.liveChatAgentName}` : 'Live Chat'}
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setLiveChatOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setLiveChatOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 h-72 overflow-y-auto bg-gray-50">
            {chatMessages.map((message, index) => (
              <div key={index} className={`mb-3 ${message.isUser ? 'text-right' : 'text-left'}`}>
                <div 
                  className={`inline-block max-w-xs p-2 rounded-lg ${
                    message.isUser 
                      ? 'text-white' 
                      : 'bg-white border'
                  }`}
                  style={message.isUser ? { backgroundColor: formData.liveChatColor } : {}}
                >
                  {message.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">{message.time}</div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-full text-sm outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="text-white px-4 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: formData.liveChatColor }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Widget Button - Fixed Position */}
      <div className={`fixed bottom-4 ${position}`} style={{ position: 'fixed', zIndex: 40 }}>
        <div className="relative group">
          {/* Tooltip */}
          {formData.tooltip && formData.tooltipDisplay === 'hover' && (
            <div className={`absolute bottom-full mb-2 ${formData.position === 'left' ? 'left-0' : 'right-0'} 
              bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              ${formData.tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
              {formData.tooltip}
              <div className={`absolute ${formData.tooltipPosition === 'top' ? 'top-full' : 'bottom-full'} 
                ${formData.position === 'left' ? 'left-4' : 'right-4'} 
                w-0 h-0 border-l-4 border-r-4 border-transparent
                ${formData.tooltipPosition === 'top' ? 'border-t-4 border-t-gray-800' : 'border-b-4 border-b-gray-800'}`}>
              </div>
            </div>
          )}
          
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            style={{
              backgroundColor: formData.buttonColor,
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              padding: 0,
              border: 'none',
              position: 'fixed'
            }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>

      {/* Widget Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" style={{ color: formData.buttonColor }} />
              {formData.greetingMessage || 'Contact us!'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {/* Video Preview */}
            {formData.useVideoPreview && (formData.videoUrl || editingWidget?.video_url) && (
              <div className="mb-4">
                <div 
                  className="relative cursor-pointer rounded-lg overflow-hidden"
                  style={{ height: `${formData.previewVideoHeight}px` }}
                  onClick={() => setVideoModalOpen(true)}
                >
                  <video
                    src={formData.videoUrl || editingWidget?.video_url}
                    className="w-full h-full object-cover"
                    style={{ objectFit: formData.videoObjectFit as any }}
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-4 border-r-0 border-t-2 border-b-2 border-transparent border-l-gray-800 ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Chat Option */}
            {formData.liveChatEnabled && (
              <div className="mb-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12"
                  style={{ 
                    borderColor: formData.liveChatColor,
                    color: formData.liveChatColor
                  }}
                  onClick={handleStartLiveChat}
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">
                      {formData.liveChatAgentName ? `Chat with ${formData.liveChatAgentName}` : 'Live Chat'}
                    </div>
                    <div className="text-xs text-gray-500">{formData.liveChatGreeting}</div>
                  </div>
                </Button>
              </div>
            )}

            {/* Contact Channels */}
            {channels.map((channel) => {
              const Icon = getChannelIcon(channel.type);
              const color = getChannelColor(channel.type);
              
              return (
                <Button
                  key={channel.id}
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-gray-50"
                  onClick={() => handleChannelClick(channel)}
                  style={{ borderColor: color }}
                >
                  <Icon className="w-5 h-5 mr-3" style={{ color }} />
                  <div className="text-left">
                    <div className="font-medium">{channel.label}</div>
                    <div className="text-xs text-gray-500">{channel.value}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Video</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <video
              src={formData.videoUrl || editingWidget?.video_url}
              className="w-full h-full rounded-lg"
              controls
              autoPlay
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
