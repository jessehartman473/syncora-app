import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationBell() {
  const [unreadCount] = useState(0);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg w-9 h-9"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-950" />
      )}
    </Button>
  );
}