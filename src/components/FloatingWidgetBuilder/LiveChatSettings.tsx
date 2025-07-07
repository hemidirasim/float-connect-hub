
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MessageSquare } from 'lucide-react';

interface LiveChatSettingsProps {
  liveChatEnabled: boolean;
  liveChatAgentName: string;
  liveChatGreeting: string;
  liveChatColor: string;
  liveChatAutoOpen: boolean;
  liveChatOfflineMessage: string;
  websiteName: string;
  onLiveChatEnabledChange: (enabled: boolean) => void;
  onLiveChatAgentNameChange: (name: string) => void;
  onLiveChatGreetingChange: (greeting: string) => void;
  onLiveChatColorChange: (color: string) => void;
  onLiveChatAutoOpenChange: (autoOpen: boolean) => void;
  onLiveChatOfflineMessageChange: (message: string) => void;
}

export const LiveChatSettings: React.FC<LiveChatSettingsProps> = ({
  liveChatEnabled,
  liveChatAgentName,
  liveChatGreeting,
  liveChatColor,
  liveChatAutoOpen,
  liveChatOfflineMessage,
  websiteName,
  onLiveChatEnabledChange,
  onLiveChatAgentNameChange,
  onLiveChatGreetingChange,
  onLiveChatColorChange,
  onLiveChatAutoOpenChange,
  onLiveChatOfflineMessageChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Live Chat Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Enable Live Chat</Label>
            <p className="text-sm text-gray-600">Allow visitors to send live messages</p>
          </div>
          <Switch
            checked={liveChatEnabled}
            onCheckedChange={onLiveChatEnabledChange}
          />
        </div>

        {liveChatEnabled && (
          <div className="space-y-4 pl-4 border-l-2 border-blue-200">
            <div className="space-y-2">
              <Label htmlFor="liveChatAgentName">Agent Name</Label>
              <Input
                id="liveChatAgentName"
                value={liveChatAgentName}
                onChange={(e) => onLiveChatAgentNameChange(e.target.value)}
                placeholder={websiteName || "Your Company"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveChatGreeting">Greeting Message</Label>
              <Textarea
                id="liveChatGreeting"
                value={liveChatGreeting}
                onChange={(e) => onLiveChatGreetingChange(e.target.value)}
                placeholder="Hello! How can we help you today?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveChatColor">Chat Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={liveChatColor}
                  onChange={(e) => onLiveChatColorChange(e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={liveChatColor}
                  onChange={(e) => onLiveChatColorChange(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Auto Open Chat</Label>
                <p className="text-sm text-gray-600">Automatically open chat when widget loads</p>
              </div>
              <Switch
                checked={liveChatAutoOpen}
                onCheckedChange={onLiveChatAutoOpenChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveChatOfflineMessage">Offline Message</Label>
              <Textarea
                id="liveChatOfflineMessage"
                value={liveChatOfflineMessage}
                onChange={(e) => onLiveChatOfflineMessageChange(e.target.value)}
                placeholder="We are currently offline. Please leave a message and we will get back to you."
                rows={2}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
