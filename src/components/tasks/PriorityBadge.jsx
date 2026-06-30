import React from 'react';
import { Badge } from '@/components/ui/badge';

const priorityConfig = {
  low: { label: 'Low', className: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  medium: { label: 'Medium', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  high: { label: 'High', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  urgent: { label: 'Urgent', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

export default function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.medium;
  return (
    <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 ${config.className}`}>
      {config.label}
    </Badge>
  );
}