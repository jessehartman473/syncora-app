import React, { useState, useRef, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import BoardCard from './BoardCard';
import { Pencil, Check } from 'lucide-react';

const defaultDot = {
  backlog: 'bg-slate-400',
  todo: 'bg-blue-500',
  in_progress: 'bg-amber-500',
  review: 'bg-purple-500',
  done: 'bg-emerald-500',
};

const defaultLabel = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

export default function BoardColumn({ status, tasks, onEdit, customLabel, onRenameColumn }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const label = customLabel || defaultLabel[status];

  const startEdit = (e) => {
    e.stopPropagation();
    setDraft(label);
    setEditing(true);
  };

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== label) onRenameColumn(status, trimmed);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setEditing(false);
  };

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] shrink-0">
      <div className="flex items-center gap-2 px-1 mb-3 group/header">
        <span className={`w-2 h-2 rounded-full shrink-0 ${defaultDot[status]}`} />
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="flex-1 text-xs font-semibold uppercase tracking-wider bg-secondary/60 text-foreground border border-primary/40 rounded px-1.5 py-0.5 outline-none"
          />
        ) : (
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex-1 truncate">
            {label}
          </h3>
        )}
        {!editing && (
          <button
            onClick={startEdit}
            className="opacity-0 group-hover/header:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            title="Rename column"
          >
            <Pencil className="w-3 h-3" />
          </button>
        )}
        {editing && (
          <button onClick={commitEdit} className="text-primary">
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <span className="text-xs text-muted-foreground/60 shrink-0">{tasks.length}</span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2 p-2 rounded-lg min-h-[120px] transition-colors duration-150 ${
              snapshot.isDraggingOver ? 'bg-primary/8 ring-1 ring-primary/20' : 'bg-secondary/30'
            }`}
          >
            {tasks.map((task, index) => (
              <BoardCard key={task.id} task={task} index={index} onEdit={onEdit} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}