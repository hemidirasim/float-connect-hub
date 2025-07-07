
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface SessionStatusBadgeProps {
  status: string;
}

export const SessionStatusBadge: React.FC<SessionStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="bg-green-500">Aktiv</Badge>;
    case 'ended':
      return <Badge variant="secondary">Bitdi</Badge>;
    case 'abandoned':
      return <Badge variant="destructive">Tərk edildi</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
