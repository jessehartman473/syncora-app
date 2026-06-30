import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTags } from '../hooks/useTags';
import { Button } from '../components/ui/button'; // Adjusted path prefix safely
import { Plus, ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import TaskFormDialog from '../components/tasks/TaskFormDialog';

export default function CalendarView() {
  const { tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: allTags = [], isLoading: tagsLoading } = useTags();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTask, setActiveTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (tasksLoading || tagsLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-sm text-muted-foreground animate-pulse">Loading Calendar Matrix...</div>
      </div>
    );
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const paddingGridArray = Array(monthStart.getDay()).fill(null);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Schedule Agenda</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Active items filtered by their upcoming targets.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-800 bg-slate-900 rounded-lg p-0.5">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 text-slate-400 hover:text-slate-100 bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-semibold px-2 min-w-[90px] text-center text-slate-200">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 text-slate-400 hover:text-slate-100 bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs h-9"
            onClick={() => {
              setActiveTask(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/50 text-center py-2.5">
          {weekdays.map((day) => (
            <div key={day} className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-slate-950 min-h-[550px] gap-px bg-slate-800/60">
          {paddingGridArray.map((_, index) => (
            <div key={`pad-${index}`} className="bg-slate-900/40 p-2 min-h-[90px]" />
          ))}

          {daysInMonth.map((day) => {
            const dayTasks = tasks.filter(task => {
              if (!task.due_date || task.status === 'done') return false;
              return isSameDay(parseISO(task.due_date), day);
            });

            return (
              <div key={day.toString()} className="bg-slate-900 p-2 min-h-[90px] hover:bg-slate-900/70 flex flex-col justify-between group">
                <div className="text-right">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    isSameDay(day, new Date()) ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>

                <div className="mt-2 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
                  {dayTasks.map((task) => {
                    const primaryTagId = Array.isArray(task.tags) && task.tags[0];
                    const matchedTag = allTags.find(t => t.id === primaryTagId);
                    const indicatorColor = matchedTag ? matchedTag.color : '#475569';

                    return (
                      <div
                        key={task.id}
                        onClick={() => {
                          setActiveTask(task);
                          setIsModalOpen(true);
                        }}
                        style={{ borderColor: indicatorColor, backgroundColor: `${indicatorColor}0d` }} 
                        className="p-1.5 border rounded text-[11px] font-medium hover:brightness-125 cursor-pointer flex items-center justify-between gap-1 transition-all truncate"
                      >
                        <div className="flex items-center gap-1 min-w-0 truncate">
                          <Circle className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                          <span className="truncate text-slate-200">
                            {task.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
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