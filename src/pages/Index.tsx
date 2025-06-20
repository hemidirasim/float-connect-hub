
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Copy, Check, MessageCircle, Send, Instagram, Mail, Link, Video } from 'lucide-react';
import { toast } from "sonner";

const Index = () => {
  const [formData, setFormData] = useState({
    whatsapp: '',
    telegram: '',
    instagram: '',
    messenger: '',
    email: '',
    customLink: '',
    video: null as File | null,
    buttonColor: '#25d366',
    position: 'right',
    tooltip: ''
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
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
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                Customize Your Widget
              </CardTitle>
              <CardDescription>
                Fill in your contact information and customize the appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    WhatsApp Number
                  </Label>
                  <Input
                    id="whatsapp"
                    placeholder="+1234567890"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegram" className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-500" />
                    Telegram Username
                  </Label>
                  <Input
                    id="telegram"
                    placeholder="@username"
                    value={formData.telegram}
                    onChange={(e) => handleInputChange('telegram', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    Instagram Link
                  </Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/username"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messenger" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    Messenger Link
                  </Label>
                  <Input
                    id="messenger"
                    placeholder="https://m.me/username"
                    value={formData.messenger}
                    onChange={(e) => handleInputChange('messenger', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-600" />
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
                  <Label htmlFor="customLink" className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-gray-600" />
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

              {/* Video Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-600" />
                  Upload Video (max 10MB)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {formData.video ? formData.video.name : 'Click to upload video'}
                    </p>
                  </label>
                </div>
              </div>

              {/* Customization Options */}
              <div className="grid grid-cols-2 gap-4">
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
                    <SelectContent>
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

          {/* Code Preview Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="w-5 h-5 text-green-600" />
                Generated Code
              </CardTitle>
              <CardDescription>
                Copy this code and paste it into your website's HTML
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedCode ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={generatedCode}
                      readOnly
                      className="min-h-[200px] font-mono text-sm bg-gray-50"
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
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Copy the generated code above</li>
                      <li>2. Paste it before the closing &lt;/body&gt; tag of your website</li>
                      <li>3. The floating contact widget will appear automatically</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Fill out the form and click "Generate Code" to see your embeddable script</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                This is how your floating contact button will look on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="relative min-h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Website preview area</p>
                  <p className="text-sm">Your floating contact button will appear here</p>
                </div>
              </div>
              
              {/* Floating Button Preview */}
              <div 
                className={`absolute bottom-6 ${formData.position === 'left' ? 'left-6' : 'right-6'} w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110`}
                style={{ backgroundColor: formData.buttonColor }}
                title={formData.tooltip || 'Contact us'}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
