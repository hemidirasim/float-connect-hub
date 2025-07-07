
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';
import { LiveChatMessage } from './types';
import { formatTime } from './utils';

interface MessageListProps {
  messages: LiveChatMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 h-[500px]">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_from_visitor ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.is_from_visitor
                  ? 'bg-muted text-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">
                  {message.sender_name}
                </span>
                {message.is_from_visitor && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    Ziyarətçi
                  </Badge>
                )}
              </div>
              <p className="text-sm">{message.message}</p>
              <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                <Clock className="w-3 h-3" />
                {formatTime(message.created_at)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
