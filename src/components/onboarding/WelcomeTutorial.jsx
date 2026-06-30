import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Columns3, Calendar, Tag, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    icon: CheckCircle2,
    title: 'Welcome to Flowboard!',
    description: 'Your personal task manager. Create tasks, track progress, and stay organized — all in one place.',
  },
  {
    icon: Columns3,
    title: 'Kanban Board',
    description: 'Drag and drop tasks across columns (Backlog → To Do → In Progress → Review → Done) to track your workflow.',
  },
  {
    icon: Calendar,
    title: 'Calendar View',
    description: 'See your tasks laid out by due date. Drag tasks to reschedule them directly on the calendar.',
  },
  {
    icon: Tag,
    title: 'Tags',
    description: 'Create colorful tags to categorize your tasks and filter them quickly across all views.',
  },
];

export default function WelcomeTutorial({ open, onClose }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">Getting Started</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center py-4 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">{current.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{current.description}</p>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mb-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        <div className="flex gap-2 justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>Skip</Button>
          <Button size="sm" onClick={() => isLast ? onClose() : setStep(step + 1)}>
            {isLast ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}