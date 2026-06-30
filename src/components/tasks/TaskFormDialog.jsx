import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Calendar } from '../../components/ui/calendar';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2, Trash2 } from 'lucide-react';
import TagPicker from './TagPicker'; // 🔒 Safe folder neighbor path
import { useTasks } from '../../hooks/useTasks'; // 🔒 Safe hook parent path

export default function TaskFormDialog({ open, onOpenChange, task }) {
  const { createTask, updateTask, deleteTask } = useTasks();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEdit = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setNotes(task.notes || '');
      setDueDate(task.due_date || '');
      setTags(Array.isArray(task.tags) ? task.tags : []);
    } else {
      setTitle('');
      setStatus('todo');
      setPriority('medium');
      setNotes('');
      setDueDate('');
      setTags([]);
    }
  }, [task, open]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);

    const payload = {
      title: title.trim(),
      status,
      priority,
      notes: notes.trim() || null,
      due_date: dueDate && dueDate !== '' ? dueDate : null,
      tags: Array.isArray(tags) ? tags : [],
    };

    try {
      if (isEdit) {
        await updateTask(task.id, payload);
      } else {
        await createTask(payload);
      }
      onOpenChange(false);
    } catch (err) {
      console.error("Task action failed:", err);
      alert("Error saving task: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task?.id) return;
    if (!window.confirm("Are you sure you want to permanently delete this task?")) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      onOpenChange(false);
    } catch (err) {
      console.error("Delete task failed:", err);
      alert("Error deleting task: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border border-slate-800 text-slate-100 sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-800/60 pb-3">
          <DialogTitle className="text-lg font-bold text-slate-100">
            {isEdit ? 'Modify Task Details' : 'Create New Target'}
          </DialogTitle>
          
          {isEdit && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting || isSaving}
              className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 transition-colors"
              title="Delete Task"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          )}
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="space-y-1.5">
            <Label className="text-slate-300 font-medium text-sm">Title</Label>
            <Input 
              placeholder="What needs to be done?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-950 border-slate-800 text-slate-100"
              disabled={isSaving || isDeleting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-slate-300 font-medium text-sm">Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={isSaving || isDeleting}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-slate-100 border-slate-800">
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300 font-medium text-sm">Priority</Label>
              <Select value={priority} onValueChange={setPriority} disabled={isSaving || isDeleting}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-slate-100 border-slate-800">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-300 font-medium text-sm">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild disabled={isSaving || isDeleting}>
                <Button variant="outline" className="w-full justify-start text-left font-normal gap-2 text-slate-100 border-slate-800 bg-slate-950 hover:bg-slate-800/50">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  {dueDate ? format(parseISO(dueDate), 'MMM d, yyyy') : <span className="text-slate-400">Set a timeline limit...</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border border-slate-800" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate ? parseISO(dueDate) : undefined}
                  onSelect={(date) => setDueDate(date ? format(date, 'yyyy-MM-dd') : '')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5 border-t border-slate-800/40 pt-3">
            <Label className="text-slate-300 font-medium text-sm">Assign Tags</Label>
            <TagPicker selectedTags={tags} onChange={setTags} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-300 font-medium text-sm">Notes</Label>
            <Textarea 
              placeholder="Context or criteria..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-950 border-slate-800 text-slate-100"
              rows={2}
              disabled={isSaving || isDeleting}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-slate-800/60 pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving || isDeleting} className="border-slate-800 bg-transparent text-slate-100 hover:bg-slate-800">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isDeleting || !title.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}