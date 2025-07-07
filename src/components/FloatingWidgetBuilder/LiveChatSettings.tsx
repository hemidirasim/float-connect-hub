
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MessageCircle } from 'lucide-react';

interface LiveChatSettingsProps {
  liveChatEnabled: boolean;
  liveChatGreeting: string;
  liveChatColor: string;
  liveChatAutoOpen: boolean;
  liveChatOfflineMessage: string;
  liveChatAgentName: string;
  onLiveChatEnabledChange: (enabled: boolean) => void;
  onLiveChatGreetingChange: (greeting: string) => void;
  onLiveChatColorChange: (color: string) => void;
  onLiveChatAutoOpenChange: (autoOpen: boolean) => void;
  onLiveChatOfflineMessageChange: (message: string) => void;
  onLiveChatAgentNameChange: (name: string) => void;
}

export const LiveChatSettings: React.FC<LiveChatSettingsProps> = ({
  liveChatEnabled,
  liveChatGreeting,
  liveChatColor,
  liveChatAutoOpen,
  liveChatOfflineMessage,
  liveChatAgentName,
  onLiveChatEnabledChange,
  onLiveChatGreetingChange,
  onLiveChatColorChange,
  onLiveChatAutoOpenChange,
  onLiveChatOfflineMessageChange,
  onLiveChatAgentNameChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Live Chat Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="live-chat-enabled"
            checked={liveChatEnabled}
            onCheckedChange={onLiveChatEnabledChange}
          />
          <Label htmlFor="live-chat-enabled">Enable Live Chat</Label>
        </div>

        {liveChatEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="live-chat-greeting">Greeting Message</Label>
              <Input
                id="live-chat-greeting"
                type="text"
                value={liveChatGreeting}
                onChange={(e) => onLiveChatGreetingChange(e.target.value)}
                placeholder="Hello! How can we help you today?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="live-chat-agent-name">Agent Name (Optional)</Label>
              <Input
                id="live-chat-agent-name"
                type="text"
                value={liveChatAgentName}
                onChange={(e) => onLiveChatAgentNameChange(e.target.value)}
                placeholder="Support Agent"
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
                  type="text"
                  value={liveChatColor}
                  onChange={(e) => onLiveChatColorChange(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="live-chat-auto-open"
                checked={liveChatAutoOpen}
                onCheckedChange={onLiveChatAutoOpenChange}
              />
              <Label htmlFor="live-chat-auto-open">Auto Open Chat</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="live-chat-offline-message">Offline Message</Label>
              <Textarea
                id="live-chat-offline-message"
                value={liveChatOfflineMessage}
                onChange={(e) => onLiveChatOfflineMessageChange(e.target.value)}
                placeholder="We are currently offline. Please leave a message..."
                rows={3}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
