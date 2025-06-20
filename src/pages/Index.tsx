
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Copy, Check, MessageCircle, Send, Instagram, Mail, Link, Video, Crown, Play, X, Phone, MessageSquare, Music } from 'lucide-react';
import { toast } from "sonner";

const Index = () => {
  const [formData, setFormData] = useState({
    whatsapp: '',
    telegram: '',
    instagram: '',
    messenger: '',
    email: '',
    customLink: '',
    viber: '',
    skype: '',
    discord: '',
    tiktok: '',
    video: null as File | null,
    buttonColor: '#25d366',
    position: 'right',
    tooltip: ''
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const platforms = {
    whatsapp: { label: 'WhatsApp', icon: MessageCircle, color: 'text-green-600', options: [
      { value: '+994501234567', label: '+994 50 123 45 67' },
      { value: '+994551234567', label: '+994 55 123 45 67' },
      { value: '+994701234567', label: '+994 70 123 45 67' },
    ]},
    telegram: { label: 'Telegram', icon: Send, color: 'text-blue-500', options: [
      { value: '@example_user', label: '@example_user' },
      { value: '@company_support', label: '@company_support' },
      { value: '@business_account', label: '@business_account' },
    ]},
    instagram: { label: 'Instagram', icon: Instagram, color: 'text-pink-600', options: [
      { value: 'https://instagram.com/example', label: '@example' },
      { value: 'https://instagram.com/business', label: '@business' },
      { value: 'https://instagram.com/company', label: '@company' },
    ]},
    messenger: { label: 'Messenger', icon: MessageSquare, color: 'text-blue-600', options: [
      { value: 'https://m.me/example', label: 'Example Page' },
      { value: 'https://m.me/business', label: 'Business Page' },
      { value: 'https://m.me/support', label: 'Support Page' },
    ]},
    viber: { label: 'Viber', icon: Phone, color: 'text-purple-600', options: [
      { value: 'viber://chat?number=+994501234567', label: '+994 50 123 45 67' },
      { value: 'viber://chat?number=+994551234567', label: '+994 55 123 45 67' },
    ]},
    skype: { label: 'Skype', icon: Video, color: 'text-blue-500', options: [
      { value: 'skype:example.user?chat', label: 'example.user' },
      { value: 'skype:business.support?chat', label: 'business.support' },
    ]},
    discord: { label: 'Discord', icon: MessageCircle, color: 'text-indigo-600', options: [
      { value: 'https://discord.gg/example', label: 'Example Server' },
      { value: 'https://discord.gg/support', label: 'Support Server' },
    ]},
    tiktok: { label: 'TikTok', icon: Music, color: 'text-pink-500', options: [
      { value: 'https://tiktok.com/@example', label: '@example' },
      { value: 'https://tiktok.com/@business', label: '@business' },
    ]}
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFormData(prev => ({
        ...prev,
        video: file
      }));
      toast.success("Video uploaded successfully!");
    } else if (file) {
      toast.error("Video file must be 10MB or less");
    }
  };

  const generateCode = () => {
    const videoUrl = formData.video ? `https://yourdomain.com/uploads/${formData.video.name}` : '';
    
    const scriptCode = `<script 
  src="https://yourdomain.com/floating.js" 
  ${formData.whatsapp ? `data-whatsapp="${formData.whatsapp}"` : ''}
  ${formData.telegram ? `data-telegram="${formData.telegram}"` : ''}
  ${formData.instagram ? `data-instagram="${formData.instagram}"` : ''}
  ${formData.messenger ? `data-messenger="${formData.messenger}"` : ''}
  ${formData.email ? `data-email="${formData.email}"` : ''}
  ${formData.customLink ? `data-custom="${formData.customLink}"` : ''}
  ${formData.viber ? `data-viber="${formData.viber}"` : ''}
  ${formData.skype ? `data-skype="${formData.skype}"` : ''}
  ${formData.discord ? `data-discord="${formData.discord}"` : ''}
  ${formData.tiktok ? `data-tiktok="${formData.tiktok}"` : ''}
  ${videoUrl ? `data-video="${videoUrl}"` : ''}
  data-position="${formData.position}"
  data-color="${formData.buttonColor}"
  ${formData.tooltip ? `data-tooltip="${formData.tooltip}"` : ''}>
</script>`;

    setGeneratedCode(scriptCode);
    toast.success("Code generated successfully!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveChannels = () => {
    const channels = [];
    if (formData.whatsapp) channels.push({ type: 'whatsapp', value: formData.whatsapp, icon: MessageCircle, color: '#25d366' });
    if (formData.telegram) channels.push({ type: 'telegram', value: formData.telegram, icon: Send, color: '#0088cc' });
    if (formData.instagram) channels.push({ type: 'instagram', value: formData.instagram, icon: Instagram, color: '#e4405f' });
    if (formData.messenger) channels.push({ type: 'messenger', value: formData.messenger, icon: MessageSquare, color: '#0084ff' });
    if (formData.email) channels.push({ type: 'email', value: formData.email, icon: Mail, color: '#ea4335' });
    if (formData.customLink) channels.push({ type: 'custom', value: formData.customLink, icon: Link, color: '#6b7280' });
    if (formData.viber) channels.push({ type: 'viber', value: formData.viber, icon: Phone, color: '#665cac' });
    if (formData.skype) channels.push({ type: 'skype', value: formData.skype, icon: Video, color: '#00aff0' });
    if (formData.discord) channels.push({ type: 'discord', value: formData.discord, icon: MessageCircle, color: '#5865f2' });
    if (formData.tiktok) channels.push({ type: 'tiktok', value: formData.tiktok, icon: Music, color: '#ff0050' });
    return channels;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Add a multi-channel floating contact panel to your website
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            WhatsApp, Telegram, Messenger, and more — all in one button. 
            Create your custom floating contact widget in seconds.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                Customize Your Widget
              </CardTitle>
              <CardDescription>
                Select your contact channels and customize the appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(platforms).map(([key, platform]) => (
                  <div key={key} className="space-y-2">
                    <Label className={`flex items-center gap-2 ${platform.color}`}>
                      <platform.icon className="w-4 h-4" />
                      {platform.label}
                    </Label>
                    <Select
                      value={formData[key as keyof typeof formData] as string}
                      onValueChange={(value) => handleInputChange(key, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${platform.label}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {platform.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-red-600">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customLink" className="flex items-center gap-2 text-gray-600">
                    <Link className="w-4 h-4" />
                    Custom Link
                  </Label>
                  <Input
                    id="customLink"
                    placeholder="https://example.com"
                    value={formData.customLink}
                    onChange={(e) => handleInputChange('customLink', e.target.value)}
                  />
                </div>
              </div>

              {/* Pro Video Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-purple-600">
                  <Crown className="w-4 h-4" />
                  Upload Video - PRO Feature
                </Label>
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
                      <Crown className="w-6 h-6 text-purple-600" />
                      <Upload className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-purple-700 font-medium">
                      {formData.video ? formData.video.name : 'Upload promotional video (max 10MB)'}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      PRO feature - Upgrade to add video content
                    </p>
                  </label>
                </div>
              </div>

              {/* Customization Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Button Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="color"
                      value={formData.buttonColor}
                      onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <Input
                      value={formData.buttonColor}
                      onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Button Position</Label>
                  <Select 
                    value={formData.position} 
                    onValueChange={(value) => handleInputChange('position', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tooltip">Call-to-Action Tooltip</Label>
                <Input
                  id="tooltip"
                  placeholder="Get in touch with us!"
                  value={formData.tooltip}
                  onChange={(e) => handleInputChange('tooltip', e.target.value)}
                />
              </div>

              <Button 
                onClick={generateCode} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                Generate Code
              </Button>
            </CardContent>
          </Card>

          {/* Live Preview Section */}
          <div className="space-y-6">
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 relative group"
                          style={{ backgroundColor: formData.buttonColor }}
                          title={formData.tooltip || 'Contact us'}
                        >
                          <MessageCircle className="w-6 h-6 text-white" />
                          {formData.tooltip && (
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {formData.tooltip}
                            </div>
                          )}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Contact Us</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          {getActiveChannels().map((channel, index) => {
                            const IconComponent = channel.icon;
                            return (
                              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                  style={{ backgroundColor: channel.color }}
                                >
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium capitalize">{channel.type}</p>
                                  <p className="text-sm text-gray-600 truncate">{channel.value}</p>
                                </div>
                              </div>
                            );
                          })}
                          
                          {formData.video && (
                            <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer bg-purple-50">
                              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                                <Play className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-purple-700">Watch Video</p>
                                <p className="text-sm text-purple-600">{formData.video.name}</p>
                              </div>
                            </div>
                          )}
                          
                          {getActiveChannels().length === 0 && !formData.video && (
                            <div className="text-center py-8 text-gray-500">
                              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No contact channels selected</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Code Preview Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="w-5 h-5 text-green-600" />
                  Generated Code
                </CardTitle>
                <CardDescription>
                  Copy and paste into your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedCode ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <Textarea
                        value={generatedCode}
                        readOnly
                        className="min-h-[150px] font-mono text-sm bg-gray-50"
                      />
                      <Button
                        onClick={copyToClipboard}
                        size="sm"
                        className="absolute top-2 right-2"
                        variant="outline"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-1 text-sm">Installation:</h4>
                      <p className="text-xs text-blue-700">
                        Paste before closing &lt;/body&gt; tag
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Copy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Generate code to see script</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
