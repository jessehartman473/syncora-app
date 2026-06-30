import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTags } from '../hooks/useTags'; // 🌟 Bring in tag assets for coloring!
import { Button } from '../components/ui/button';
import { Plus, CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';
import TaskFormDialog from '../components/tasks/TaskFormDialog';

export default function Dashboard() {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { data: allTags = [], isLoading: tagsLoading } = useTags(); // Load reusable tags
  const [activeTask, setActiveTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 🎯 Filter states: 'all', 'pending', 'completed', 'urgent'
  const [statusFilter, setStatusFilter] = useState('all');

  if (tasksLoading || tagsLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-sm text-muted-foreground animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  const safeTasks = tasks || [];
  
  // Calculate total counts accurately for the metric headers
  const completedCount = safeTasks.filter(t => t?.status === 'done').length;
  const pendingCount = safeTasks.filter(t => t?.status !== 'done').length;
  const urgentCount = safeTasks.filter(t => t?.status !== 'done' && t?.priority === 'urgent').length;

  // Filter tasks dynamically depending on which card is selected
  const filteredTasks = safeTasks.filter(task => {
    if (statusFilter === 'pending') return task.status !== 'done';
    if (statusFilter === 'completed') return task.status === 'done';
    if (statusFilter === 'urgent') return task.status !== 'done' && task.priority === 'urgent';
    return true; // 'all' showing everything
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Title Bar Layout */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Workspace Overview</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Click any metric block below to filter task list items.</p>
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

      {/* 📊 Part 1: Clickable Metric Status Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Card Toggle */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
          className={`p-4 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
            statusFilter === 'pending' 
              ? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/30' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{pendingCount}</div>
            <p className="text-xs text-muted-foreground font-medium">Pending Tasks</p>
          </div>
        </div>

        {/* Completed Card Toggle */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
          className={`p-4 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
            statusFilter === 'completed' 
              ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{completedCount}</div>
            <p className="text-xs text-muted-foreground font-medium">Completed Tasks</p>
          </div>
        </div>

        {/* Urgent Card Toggle */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'urgent' ? 'all' : 'urgent')}
          className={`p-4 border rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
            statusFilter === 'urgent' 
              ? 'bg-red-500/10 border-red-500/50 ring-1 ring-red-500/30' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100">{urgentCount}</div>
            <p className="text-xs text-muted-foreground font-medium">Urgent Actions</p>
          </div>
        </div>
      </div>

      {/* 📝 Part 2: Task Items List Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200">
            {statusFilter === 'all' ? 'Recent Items' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} List`}
          </h3>
          {statusFilter !== 'all' && (
            <button 
              onClick={() => setStatusFilter('all')}
              className="text-[11px] text-indigo-400 hover:underline bg-transparent border-none"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="space-y-2">
          {filteredTasks.slice(0, 8).map((task) => {
            // Find the custom tag definition data color hex code
            const primaryTagId = Array.isArray(task.tags) && task.tags[0];
            const matchedTag = allTags.find(t => t.id === primaryTagId);
            
            // Generate custom tint backgrounds safely
            const borderHex = matchedTag ? matchedTag.color : '#334155'; // Fallback to standard slate
            const bgTint = matchedTag ? `${matchedTag.color}0c` : '#020617'; // Adds alpha opacity transparency

            return (
              <div
                key={task.id}
                onClick={() => {
                  setActiveTask(task);
                  setIsModalOpen(true);
                }}
                style={{ borderColor: borderHex, backgroundColor: bgTint }} // 🎨 Full colorful border & background tint wrapper!
                className="p-3 border rounded-lg flex items-center justify-between cursor-pointer transition-all hover:brightness-125"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-slate-200'}`}>
                    {task.title}
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold shrink-0 ${
                  task.priority === 'urgent' ? 'bg-red-500/10 text-red-500' :
                  task.priority === 'high' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {task.priority}
                </span>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground italic">
              No matching tasks found for this view state filter.
            </div>
          )}
        </div>
      </div>

      <TaskFormDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={activeTask}
      />
    </div>
  );
}