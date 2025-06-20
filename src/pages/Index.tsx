import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Upload, Copy, Check, MessageCircle, Send, Instagram, Mail, Link, Video, Crown, Play, X, Phone, MessageSquare, Music, Plus, Trash2, Github, Twitter, Linkedin, ExternalLink, User, LogOut, Settings, GripVertical, Edit } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableChannelItem } from "@/components/SortableChannelItem";

const Index = () => {
  const [channels, setChannels] = useState<Array<{id: string, type: string, value: string, label: string}>>([]);
  const [selectedChannelType, setSelectedChannelType] = useState('');
  const [channelValue, setChannelValue] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [formData, setFormData] = useState({
    video: null as File | null,
    buttonColor: '#25d366',
    position: 'right',
    tooltip: '',
    useVideoPreview: false
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const platformOptions = [
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25d366' },
    { value: 'telegram', label: 'Telegram', icon: Send, color: '#0088cc' },
    { value: 'instagram', label: 'Instagram', icon: Instagram, color: '#e4405f' },
    { value: 'messenger', label: 'Messenger', icon: MessageSquare, color: '#0084ff' },
    { value: 'viber', label: 'Viber', icon: Phone, color: '#665cac' },
    { value: 'skype', label: 'Skype', icon: Video, color: '#00aff0' },
    { value: 'discord', label: 'Discord', icon: MessageCircle, color: '#5865f2' },
    { value: 'tiktok', label: 'TikTok', icon: Music, color: '#ff0050' },
    { value: 'email', label: 'Email', icon: Mail, color: '#ea4335' },
    { value: 'custom', label: 'Custom Link', icon: Link, color: '#6b7280' }
  ];

  // Check for widget to edit on component mount
  useEffect(() => {
    const editWidgetId = localStorage.getItem('editWidgetId');
    if (editWidgetId && user) {
      loadWidgetForEditing(editWidgetId);
      localStorage.removeItem('editWidgetId');
    }
  }, [user]);

  const loadWidgetForEditing = async (widgetId: string) => {
    try {
      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .eq('id', widgetId)
        .single();

      if (error) throw error;

      if (data) {
        setEditingWidget(data);
        setWebsiteUrl(data.website_url);
        setChannels(data.channels || []);
        setFormData({
          video: null,
          buttonColor: data.button_color,
          position: data.position,
          tooltip: data.tooltip || '',
          useVideoPreview: data.video_enabled
        });
        toast.success('Widget yükləndi - redaktə edə bilərsiniz');
      }
    } catch (error) {
      console.error('Error loading widget:', error);
      toast.error('Widget yüklənməkdə xəta');
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Çıxış xətası: " + error.message);
    } else {
      toast.success("Uğurla çıxdınız!");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
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

  const addChannel = () => {
    if (selectedChannelType && channelValue.trim()) {
      const platform = platformOptions.find(p => p.value === selectedChannelType);
      const newChannel = {
        id: Date.now().toString(),
        type: selectedChannelType,
        value: channelValue.trim(),
        label: platform?.label || 'Custom'
      };
      setChannels(prev => [...prev, newChannel]);
      setChannelValue('');
      setSelectedChannelType('');
      toast.success(`${platform?.label || 'Channel'} added successfully!`);
    }
  };

  const removeChannel = (id: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
    toast.success("Channel removed");
  };

  const editChannel = (id: string, newValue: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === id ? { ...channel, value: newValue } : channel
    ));
    toast.success("Channel updated");
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setChannels((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveWidget = async () => {
    if (!user) {
      toast.error("Kod yaratmaq üçün hesabınıza giriş edin");
      setAuthModalOpen(true);
      return;
    }

    if (!websiteUrl.trim()) {
      toast.error("Website URL-i daxil edin");
      return;
    }

    if (channels.length === 0) {
      toast.error("Ən azı bir kanal əlavə edin");
      return;
    }

    setSaving(true);
    try {
      const widgetData = {
        name: `${websiteUrl} Widget`,
        website_url: websiteUrl,
        button_color: formData.buttonColor,
        position: formData.position,
        tooltip: formData.tooltip,
        video_enabled: formData.useVideoPreview,
        button_style: 'circle',
        custom_icon_url: '',
        show_on_mobile: true,
        show_on_desktop: true,
        channels: channels,
        updated_at: new Date().toISOString()
      };

      if (editingWidget) {
        // Update existing widget
        const { error } = await supabase
          .from('widgets')
          .update(widgetData)
          .eq('id', editingWidget.id);

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

    } catch (error) {
      console.error('Error saving widget:', error);
      toast.error('Widget saxlanılarkən xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  const generateCode = async () => {
    await saveWidget();
    
    const videoUrl = formData.video ? `https://yourdomain.com/uploads/${formData.video.name}` : '';
    
    let scriptCode = `<script src="https://yourdomain.com/floating.js"`;
    
    channels.forEach(channel => {
      scriptCode += `\n  data-${channel.type}="${channel.value}"`;
    });
    
    if (videoUrl) {
      scriptCode += `\n  data-video="${videoUrl}"`;
    }
    
    scriptCode += `\n  data-position="${formData.position}"`;
    scriptCode += `\n  data-color="${formData.buttonColor}"`;
    
    if (formData.tooltip) {
      scriptCode += `\n  data-tooltip="${formData.tooltip}"`;
    }

    if (formData.useVideoPreview) {
      scriptCode += `\n  data-video-preview="true"`;
    }
    
    scriptCode += `>\n</script>`;

    setGeneratedCode(scriptCode);
    toast.success("Code generated successfully!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getChannelIcon = (type: string) => {
    const platform = platformOptions.find(p => p.value === type);
    return platform?.icon || Link;
  };

  const getChannelColor = (type: string) => {
    const platform = platformOptions.find(p => p.value === type);
    return platform?.color || '#6b7280';
  };

  const getPlaceholderText = () => {
    switch (selectedChannelType) {
      case 'whatsapp':
      case 'viber':
        return '+994501234567';
      case 'telegram':
        return '@username';
      case 'instagram':
        return 'https://instagram.com/username';
      case 'messenger':
        return 'https://m.me/pagename';
      case 'skype':
        return 'username';
      case 'discord':
        return 'https://discord.gg/invite';
      case 'tiktok':
        return 'https://tiktok.com/@username';
      case 'email':
        return 'contact@example.com';
      case 'custom':
        return 'https://example.com';
      default:
        return 'Enter contact info...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FloatWidget
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#support" className="text-gray-600 hover:text-blue-600 transition-colors">Support</a>
              {!loading && (
                user ? (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                      <Settings className="w-4 h-4 mr-1" />
                      Dashboard
                    </Button>
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <Button variant="outline" size="sm" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-1" />
                      Çıxış
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setAuthModalOpen(true)}>
                    <User className="w-4 h-4 mr-1" />
                    Giriş
                  </Button>
                )
              )}
            </nav>
          </div>
        </div>
      </header>

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
                {editingWidget ? 'Edit Your Widget' : 'Customize Your Widget'}
              </CardTitle>
              <CardDescription>
                {editingWidget ? 'Update your contact channels and appearance' : 'Add your contact channels and customize the appearance'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Website URL */}
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Add Channel Section */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Contact Channels</Label>
                
                {/* Add New Channel */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Select value={selectedChannelType} onValueChange={setSelectedChannelType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {platformOptions.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            <div className="flex items-center gap-2">
                              <platform.icon className="w-4 h-4" style={{ color: platform.color }} />
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
                      className="md:col-span-1"
                    />
                    
                    <Button 
                      onClick={addChannel}
                      disabled={!selectedChannelType || !channelValue.trim()}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Added Channels List with Drag and Drop */}
                {channels.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Added Channels (drag to reorder):</Label>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext items={channels.map(c => c.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
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
                  </div>
                )}
              </div>

              {/* Pro Video Upload */}
              <div className="space-y-4">
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

                {/* Video Preview Option */}
                {formData.video && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-purple-600" />
                      <Label className="text-sm text-purple-700">Use video as button preview (first 3 seconds)</Label>
                    </div>
                    <Switch
                      checked={formData.useVideoPreview}
                      onCheckedChange={(checked) => handleInputChange('useVideoPreview', checked)}
                    />
                  </div>
                )}
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
                disabled={saving}
              >
                {saving ? 'Saving...' : (editingWidget ? 'Update & Generate Code' : 'Generate Code')}
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
                    <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
                      <DialogTrigger asChild>
                        <button
                          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 relative group overflow-hidden"
                          style={{ backgroundColor: formData.buttonColor }}
                          title={formData.tooltip || 'Contact us'}
                        >
                          {formData.video && formData.useVideoPreview ? (
                            <video
                              className="w-full h-full object-cover rounded-full"
                              autoPlay
                              muted
                              loop
                              playsInline
                            >
                              <source src={URL.createObjectURL(formData.video)} type={formData.video.type} />
                            </video>
                          ) : (
                            <MessageCircle className="w-6 h-6 text-white" />
                          )}
                          {formData.tooltip && (
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {formData.tooltip}
                            </div>
                          )}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Contact Us</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          {/* Video Section - Shows first and auto-plays with sound */}
                          {formData.video && (
                            <div className="mb-4">
                              <video
                                className="w-full rounded-lg"
                                controls
                                autoPlay
                                playsInline
                              >
                                <source src={URL.createObjectURL(formData.video)} type={formData.video.type} />
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
                          
                          {channels.length === 0 && !formData.video && (
                            <div className="text-center py-8 text-gray-500">
                              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No contact channels added yet</p>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">FloatWidget</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Create beautiful floating contact widgets for your website in minutes.
              </p>
              <div className="flex space-x-4">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 FloatWidget. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;
