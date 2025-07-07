
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MessageSquare } from 'lucide-react';

interface LiveChatSettingsProps {
  liveChatEnabled: boolean;
  liveChatAgentName: string;
  websiteName: string;
  onLiveChatEnabledChange: (enabled: boolean) => void;
  onLiveChatAgentNameChange: (name: string) => void;
}

export const LiveChatSettings: React.FC<LiveChatSettingsProps> = ({
  liveChatEnabled,
  liveChatAgentName,
  websiteName,
  onLiveChatEnabledChange,
  onLiveChatAgentNameChange
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};
