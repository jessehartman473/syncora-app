import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import PriorityBadge from '../tasks/PriorityBadge';
import { Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function BoardCard({ task, index, onEdit }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit(task)}
          className={`group p-3 rounded-lg border bg-card cursor-pointer transition-all duration-150 ${
            snapshot.isDragging
              ? 'shadow-lg border-primary/30 ring-2 ring-primary/10'
              : 'border-border hover:border-primary/20 hover:shadow-sm'
          }`}
        >
          <p className="text-sm font-medium leading-snug mb-2">{task.title}</p>

          <div className="flex items-center gap-1.5 flex-wrap">
            <PriorityBadge priority={task.priority} />
            {task.due_date && (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                <Calendar className="w-3 h-3" />
                {format(new Date(task.due_date), 'MMM d')}
              </span>
            )}
          </div>

          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/5 text-primary/70 font-medium">
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{task.tags.length - 3}</span>
              )}
            </div>
          )}

          {task.notes && (
            <div className="mt-2 flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="w-3 h-3" />
              <span className="text-[10px]">Note</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}