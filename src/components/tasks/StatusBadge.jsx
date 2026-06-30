import React from 'react';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
  backlog: { label: 'Backlog', className: 'bg-muted text-muted-foreground border-border' },
  todo: { label: 'To Do', className: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  in_progress: { label: 'In Progress', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  review: { label: 'Review', className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  done: { label: 'Done', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.todo;
  return (
    <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 ${config.className}`}>
      {config.label}
    </Badge>
  );
}