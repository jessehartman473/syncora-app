import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { isSameDay, isToday, format } from 'date-fns';
import { getPrimaryTagStyle } from '../../utils/tagColors';
import useTags from '../../hooks/useTags';

export default function CalendarDayCell({ date, tasks, isCurrentMonth, onEditTask }) {
  const { data: allTags } = useTags();

  // Build a name → tag map for quick color lookups
  const tagMap = Object.fromEntries((allTags || []).map((t) => [t.name, t]));

  // Parse date as local time to avoid UTC offset shifting the day
  const dayTasks = tasks.filter((t) => {
    if (!t.due_date) return false;
    const [year, month, day] = t.due_date.split('-').map(Number);
    return isSameDay(new Date(year, month - 1, day), date);
  });
  const dateStr = format(date, 'yyyy-MM-dd');
  const today = isToday(date);

  return (
    <Droppable droppableId={`cal-${dateStr}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[100px] md:min-h-[120px] border-b border-r border-border p-1.5 transition-colors ${
            !isCurrentMonth ? 'opacity-40' : ''
          } ${snapshot.isDraggingOver ? 'bg-primary/8' : ''}`}
        >
          <span
            className={`inline-flex items-center justify-center text-xs font-medium w-6 h-6 rounded-full mb-1 ${
              today ? 'bg-primary text-primary-foreground' : 'text-foreground'
            }`}
          >
            {format(date, 'd')}
          </span>

          <div className="space-y-1">
            {dayTasks.map((task, index) => {
              const primary = getPrimaryTagStyle(task.tags, tagMap);
              return (
                <Draggable key={task.id} draggableId={`cal-task-${task.id}`} index={index}>
                  {(dragProvided, dragSnapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      onClick={() => onEditTask(task)}
                      style={primary ? primary.style : undefined}
                      className={`text-xs px-2 py-1 rounded-full cursor-pointer truncate font-medium transition-all ${
                        !primary ? 'bg-secondary text-secondary-foreground' : ''
                      } ${dragSnapshot.isDragging ? 'shadow-lg opacity-90' : 'hover:opacity-80'}`}
                    >
                      {task.title}
                    </div>
                  )}
                </Draggable>
              );
            })}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}