import React from 'react';
import StatusBadge from '../tasks/StatusBadge';
import PriorityBadge from '../tasks/PriorityBadge';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

export default function RecentTasks({ tasks, onEdit }) {
  const recent = [...tasks]
    .sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date))
    .slice(0, 8);

  if (recent.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No tasks yet. Create your first task to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recent.map((task) => (
        <div
          key={task.id}
          onClick={() => onEdit(task)}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{task.title}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {task.due_date && (
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(task.due_date), 'MMM d')}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}