
export interface LiveChatMessage {
  id: string;
  session_id?: string;
  widget_id: string;
  sender_name: string;
  sender_email?: string;
  message: string;
  is_from_visitor: boolean;
  created_at: string;
}

export interface ChatSession {
  id: string;
  widget_id: string;
  visitor_name: string;
  visitor_email?: string;
  visitor_phone?: string;
  custom_fields?: any;
  status: 'active' | 'ended' | 'abandoned';
  started_at: string;
  ended_at?: string;
  last_message_at: string;
  unread_count: number; // Now from database
}

export interface Widget {
  id: string;
  name: string;
  website_url: string;
}
