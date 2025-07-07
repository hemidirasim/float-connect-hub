
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle } from 'lucide-react';
import { ChatSession } from './types';

interface MessageInputProps {
  selectedSession: string;
  selectedSessionData?: ChatSession;
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  selectedSession,
  selectedSessionData,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!selectedSession) return null;

  return (
    <div className="border-t p-4">
      {selectedSessionData?.status === 'active' ? (
        <div className="flex gap-2">
          <Input
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="text-center text-muted-foreground p-4 bg-muted/50 rounded-lg">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Söhbət bitib - mesaj göndərmək mümkün deyil</p>
        </div>
      )}
    </div>
  );
};
