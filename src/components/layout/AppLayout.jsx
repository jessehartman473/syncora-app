import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import TaskFormDialog from '../tasks/TaskFormDialog';

export default function AppLayout() {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar onNewTask={() => setTaskDialogOpen(true)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileHeader onNewTask={() => setTaskDialogOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <TaskFormDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
      />
    </div>
  );
}