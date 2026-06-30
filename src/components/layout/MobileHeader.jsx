import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Columns3, Calendar, Plus, Settings, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import QuickImportDialog from '../tasks/QuickImportDialog';
import NotificationBell from './NotificationBell';

const navItems = [
  { label: 'Home', icon: LayoutDashboard, path: '/' },
  { label: 'Board', icon: Columns3, path: '/board' },
  { label: 'Calendar', icon: Calendar, path: '/calendar' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function MobileHeader({ onNewTask }) {
  const location = useLocation();
  const { user } = useAuth();
  const [importOpen, setImportOpen] = useState(false);
  const avatarUrl = user?.avatar_url;

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border border-border overflow-hidden bg-secondary flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-muted-foreground">
                {user?.full_name?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <span className="font-bold text-base">Flowboard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <NotificationBell />
          <Button onClick={() => setImportOpen(true)} variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
            <Upload className="w-3.5 h-3.5" />
            Import
          </Button>
          <Button onClick={onNewTask} size="sm" className="gap-1.5 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" />
            New
          </Button>
        </div>
      </div>
      <nav className="flex border-b border-border bg-card">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <QuickImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}