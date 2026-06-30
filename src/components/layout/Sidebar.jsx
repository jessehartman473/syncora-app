import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Columns3, Calendar, Plus, Settings, Upload, Info, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/base44Client';
import QuickImportDialog from '../tasks/QuickImportDialog';
import NotificationBell from './NotificationBell';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Board', icon: Columns3, path: '/board' },
  { label: 'Calendar', icon: Calendar, path: '/calendar' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ onNewTask }) {
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [importOpen, setImportOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Synchronize avatar directly from the underlying system state on navigation shifts
  useEffect(() => {
    async function syncActiveAvatar() {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.user_metadata?.avatar_url) {
        setAvatarUrl(data.user.user_metadata.avatar_url);
      } else if (authUser?.avatar_url) {
        setAvatarUrl(authUser.avatar_url);
      }
    }
    syncActiveAvatar();
  }, [location.pathname, authUser]);

  // 🚨 NEW: Bug report click action handler
  const handleBugReportClick = async () => {
    const description = prompt("What problem are you experiencing with Syncora?");
    if (!description || description.trim() === "") return;

    const isCritical = confirm(
      "Is this an emergency blocking you from using the app?\n\n" +
      "Click 'OK' for Critical (Blocked)\n" +
      "Click 'Cancel' for a standard Minor bug report."
    );

    const impactLevel = isCritical ? "Critical (Blocked)" : "Annoying";

    const { error } = await supabase
      .from('BugReport')
      .insert([
        {
          category: 'General App Issue',
          description: description,
          impact_level: impactLevel
        }
      ]);

    if (error) {
      alert("Oops! Something went wrong submitting your report. Please try again.");
    } else {
      alert("Thank you! Your feedback has been safely logged.");
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900 h-screen sticky top-0 text-slate-100">
      {/* Top Brand Block */}
      <div className="p-6 border-b border-slate-800 bg-slate-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Columns3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-100">Syncora</h1>
              <p className="text-xs text-slate-400">Workspace Hub</p>
            </div>
          </div>
          <NotificationBell />
        </div>
      </div>

      {/* Center Nav Items List Links */}
      <nav className="flex-1 p-4 space-y-1 bg-slate-900">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-inner'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Option Footer Controls Block */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/20 space-y-2">
        {/* Quick Import Button */}
        <Button 
          onClick={() => setImportOpen(true)} 
          variant="outline" 
          className="w-full gap-2 text-xs border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white" 
          size="sm"
        >
          <Upload className="w-3.5 h-3.5 text-slate-400" />
          Quick Import
        </Button>
        
        {/* New Task Call Button */}
        <Button 
          onClick={onNewTask} 
          className="w-full gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10" 
          size="sm"
        >
          <Plus className="w-3.5 h-3.5" />
          New Task
        </Button>

        {/* Info Anchor Link */}
        <Link 
          to="/about" 
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors pt-1 px-1"
        >
          <Info className="w-3.5 h-3.5" /> About Syncora
        </Link>

        {/* 🚨 NEW: Clickable Problem Text Link placed in your red circle target */}
        <button
          onClick={handleBugReportClick}
          className="block w-full text-left text-[11px] text-slate-500 hover:text-red-400 transition-colors pl-6 pt-0.5 pb-1 underline bg-transparent border-0 cursor-pointer"
        >
          Report a problem
        </button>

        {/* User Account Drawer Dropdown Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 mt-2 px-1.5 py-1.5 rounded-lg hover:bg-slate-800/80 border border-transparent hover:border-slate-800 transition-all w-full text-left bg-transparent">
              <div className="w-7 h-7 rounded-full border border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-slate-300">
                    {authUser?.full_name?.[0]?.toUpperCase() || authUser?.email?.[0]?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{authUser?.full_name || 'User Profile'}</p>
                <p className="text-[10px] text-slate-400 truncate">{authUser?.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-48 bg-slate-900 border-slate-800 text-slate-100">
            <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut className="w-4 h-4" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <QuickImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </aside>
  );
}