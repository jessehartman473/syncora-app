import React from 'react';
import { X } from 'lucide-react';
import StatusBadge from '../tasks/StatusBadge';
import PriorityBadge from '../tasks/PriorityBadge';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

export default function TaskFilterPanel({ label, tasks, onEdit, onClose }) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-card/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40">
        <h3 className="text-sm font-semibold">{label}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No tasks in this category</div>
      ) : (
        <div className="divide-y divide-border">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onEdit(task)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 cursor-pointer transition-colors"
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
      )}
    </div>
  );
}