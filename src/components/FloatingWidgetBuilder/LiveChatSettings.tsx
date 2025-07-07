import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from 'lucide-react';

interface LiveChatSettingsProps {
  liveChatEnabled: boolean;
  liveChatAgentName: string;
  liveChatGreeting: string;
  liveChatColor: string;
  liveChatAutoOpen: boolean;
  liveChatOfflineMessage: string;
  liveChatRequireEmail: boolean;
  liveChatRequireName: boolean;
  liveChatRequirePhone: boolean;
  liveChatCustomFields: string;
  onLiveChatEnabledChange: (enabled: boolean) => void;
  onLiveChatAgentNameChange: (name: string) => void;
  onLiveChatGreetingChange: (greeting: string) => void;
  onLiveChatColorChange: (color: string) => void;
  onLiveChatAutoOpenChange: (autoOpen: boolean) => void;
  onLiveChatOfflineMessageChange: (message: string) => void;
  onLiveChatRequireEmailChange: (required: boolean) => void;
  onLiveChatRequireNameChange: (required: boolean) => void;
  onLiveChatRequirePhoneChange: (required: boolean) => void;
  onLiveChatCustomFieldsChange: (fields: string) => void;
}

export const LiveChatSettings: React.FC<LiveChatSettingsProps> = ({
  liveChatEnabled,
  liveChatAgentName,
  liveChatGreeting,
  liveChatColor,
  liveChatAutoOpen,
  liveChatOfflineMessage,
  liveChatRequireEmail,
  liveChatRequireName,
  liveChatRequirePhone,
  liveChatCustomFields,
  onLiveChatEnabledChange,
  onLiveChatAgentNameChange,
  onLiveChatGreetingChange,
  onLiveChatColorChange,
  onLiveChatAutoOpenChange,
  onLiveChatOfflineMessageChange,
  onLiveChatRequireEmailChange,
  onLiveChatRequireNameChange,
  onLiveChatRequirePhoneChange,
  onLiveChatCustomFieldsChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Live Chat Settings
        </CardTitle>
        <CardDescription>
          Enable live chat functionality for real-time customer support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Enable Live Chat</Label>
            <p className="text-sm text-muted-foreground">
              Allow visitors to start live chat conversations
            </p>
          </div>
          <Switch
            checked={liveChatEnabled}
            onCheckedChange={onLiveChatEnabledChange}
          />
        </div>

        {liveChatEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="liveChatAgentName">Agent Name</Label>
              <Input
                id="liveChatAgentName"
                placeholder="Support Agent"
                value={liveChatAgentName}
                onChange={(e) => onLiveChatAgentNameChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveChatGreeting">Chat Greeting Message</Label>
              <Textarea
                id="liveChatGreeting"
                placeholder="Hello! How can we help you today?"
                value={liveChatGreeting}
                onChange={(e) => onLiveChatGreetingChange(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveChatColor">Chat Theme Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="liveChatColor"
                  value={liveChatColor}
                  onChange={(e) => onLiveChatColorChange(e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <Input
                  value={liveChatColor}
                  onChange={(e) => onLiveChatColorChange(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveChatOfflineMessage">Offline Message</Label>
              <Textarea
                id="liveChatOfflineMessage"
                placeholder="We are currently offline. Please leave a message and we will get back to you."
                value={liveChatOfflineMessage}
                onChange={(e) => onLiveChatOfflineMessageChange(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Auto-open Chat</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically open chat when visitor clicks the widget
                </p>
              </div>
              <Switch
                checked={liveChatAutoOpen}
                onCheckedChange={onLiveChatAutoOpenChange}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-base font-semibold">Pre-Chat Form Settings</Label>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Require Name</Label>
                  <p className="text-sm text-muted-foreground">
                    Ask for visitor's name before starting chat
                  </p>
                </div>
                <Switch
                  checked={liveChatRequireName}
                  onCheckedChange={onLiveChatRequireNameChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Require Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Ask for visitor's email address before starting chat
                  </p>
                </div>
                <Switch
                  checked={liveChatRequireEmail}
                  onCheckedChange={onLiveChatRequireEmailChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Require Phone</Label>
                  <p className="text-sm text-muted-foreground">
                    Ask for visitor's phone number before starting chat
                  </p>
                </div>
                <Switch
                  checked={liveChatRequirePhone}
                  onCheckedChange={onLiveChatRequirePhoneChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="liveChatCustomFields">Custom Fields</Label>
                <Textarea
                  id="liveChatCustomFields"
                  placeholder="Enter custom field names separated by commas (e.g., Company, Department, Subject)"
                  value={liveChatCustomFields}
                  onChange={(e) => onLiveChatCustomFieldsChange(e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Add custom fields that visitors need to fill before starting chat
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};