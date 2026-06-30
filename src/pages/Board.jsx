import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskFormDialog from '../components/tasks/TaskFormDialog';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
];

export default function Board() {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
  const [activeTask, setActiveTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading Board...</div>;
  }

  const safeTasks = tasks || [];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Task Board</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Drag, drop, or click items to update columns.</p>
        </div>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs"
          onClick={() => {
            setActiveTask(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((column) => {
          const columnTasks = safeTasks.filter(t => t?.status === column.id);

          return (
            <div key={column.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">{column.title}</span>
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 font-bold">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setActiveTask(task);
                      setIsModalOpen(true);
                    }}
                    className="p-3 bg-slate-950 hover:bg-slate-800/40 border border-slate-800/60 rounded-lg cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-slate-200 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                        {task.title}
                      </h4>
                    </div>
                    {task.priority && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                        task.priority === 'urgent' ? 'bg-red-500/10 text-red-400' :
                        task.priority === 'high' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <TaskFormDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={activeTask}
        onCreateTask={createTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}