
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from 'lucide-react';

interface LiveChatSettingsProps {
  liveChatEnabled: boolean;
  liveChatGreeting: string;
  liveChatColor: string;
  liveChatAutoOpen: boolean;
  liveChatOfflineMessage: string;
  onLiveChatEnabledChange: (enabled: boolean) => void;
  onLiveChatGreetingChange: (greeting: string) => void;
  onLiveChatColorChange: (color: string) => void;
  onLiveChatAutoOpenChange: (autoOpen: boolean) => void;
  onLiveChatOfflineMessageChange: (message: string) => void;
}

export const LiveChatSettings: React.FC<LiveChatSettingsProps> = ({
  liveChatEnabled,
  liveChatGreeting,
  liveChatColor,
  liveChatAutoOpen,
  liveChatOfflineMessage,
  onLiveChatEnabledChange,
  onLiveChatGreetingChange,
  onLiveChatColorChange,
  onLiveChatAutoOpenChange,
  onLiveChatOfflineMessageChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Live Chat Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="live-chat-enabled">Enable Live Chat</Label>
          <Switch
            id="live-chat-enabled"
            checked={liveChatEnabled}
            onCheckedChange={onLiveChatEnabledChange}
          />
        </div>

        {liveChatEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="live-chat-greeting">Welcome Message</Label>
              <Textarea
                id="live-chat-greeting"
                value={liveChatGreeting}
                onChange={(e) => onLiveChatGreetingChange(e.target.value)}
                placeholder="Hello! How can we help you today?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="live-chat-color">Chat Color</Label>
              <div className="flex gap-2">
                <Input
                  id="live-chat-color"
                  type="color"
                  value={liveChatColor}
                  onChange={(e) => onLiveChatColorChange(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={liveChatColor}
                  onChange={(e) => onLiveChatColorChange(e.target.value)}
                  placeholder="#4f46e5"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="live-chat-auto-open">Auto-open Chat</Label>
              <Switch
                id="live-chat-auto-open"
                checked={liveChatAutoOpen}
                onCheckedChange={onLiveChatAutoOpenChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="live-chat-offline">Offline Message</Label>
              <Textarea
                id="live-chat-offline"
                value={liveChatOfflineMessage}
                onChange={(e) => onLiveChatOfflineMessageChange(e.target.value)}
                placeholder="We are currently offline. Please leave a message and we will get back to you."
                rows={2}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
