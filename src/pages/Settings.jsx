import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Sun, Moon, Upload, Loader2, Download, Trash2, Shield, Bell, Sliders, Database, LogOut } from 'lucide-react';
import { supabase } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { useTasks } from '../hooks/useTasks'; // Kept relative since hooks path is next door

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-5 border-b border-slate-800/60 pb-3">
        <Icon className="w-4 h-4 text-indigo-400" />
        <h3 className="font-semibold text-slate-100 text-sm tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-800/50 last:border-b-0">
      <div className="min-w-0 pr-2">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="ml-4 shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { data: tasks = [] } = useTasks();
  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || user?.avatar_url || ''
  );
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef();

  const [taskReminders, setTaskReminders] = useState(
    () => localStorage.getItem('pref-task-reminders') !== 'false'
  );
  const [importAlerts, setImportAlerts] = useState(
    () => localStorage.getItem('pref-import-alerts') !== 'false'
  );
  const [landingPage, setLandingPage] = useState(
    () => localStorage.getItem('pref-landing-page') || 'dashboard'
  );

  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const [dbTags, setDbTags] = useState([]);
  const [selectedTagToPurge, setSelectedTagToPurge] = useState('');
  const [purgingTag, setPurgingTag] = useState(false);

  useEffect(() => {
    async function fetchUserTags() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user?.id) return;

        // Sync the avatar image from metadata if it exists
        if (authData.user.user_metadata?.avatar_url) {
          setAvatarUrl(authData.user.user_metadata.avatar_url);
        }

        const { data, error } = await supabase
          .from('Tag')
          .select('name')
          .eq('user_id', authData.user.id);

        if (error) throw error;
        if (data) {
          const tagNames = Array.from(new Set(data.map(t => t.name))).filter(Boolean);
          setDbTags(tagNames);
        }
      } catch (err) {
        console.error("Failed to load global tags for settings cleanup:", err);
      }
    }
    fetchUserTags();
  }, [tasks, user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setAvatarError('');

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) throw new Error("No user session found");

      const fileExt = file.name.split('.').pop();
      const filePath = `${authData.user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: profileUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (profileUpdateError) throw profileUpdateError;

      await supabase.auth.refreshSession();
      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error('Avatar pipeline glitch details:', error);
      setAvatarError(`Upload error: ${error.message || 'Check storage policies.'}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePurgeTagTasks = async () => {
    if (!selectedTagToPurge) return;
    
    const confirmation = window.confirm(`Are you absolutely sure you want to delete every single task attached to "${selectedTagToPurge}"?`);
    if (!confirmation) return;

    setPurgingTag(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;

      if (currentUserId) {
        const { data: tagRecords, error: findTagError } = await supabase
          .from('Tag')
          .select('id')
          .eq('user_id', currentUserId)
          .eq('name', selectedTagToPurge);

        if (findTagError) throw findTagError;

        if (tagRecords && tagRecords.length > 0) {
          const targetTagIds = tagRecords.map(t => t.id);

          const { data: allTasks, error: fetchTasksError } = await supabase
            .from('Task')
            .select('id, tags')
            .eq('user_id', currentUserId);

          if (fetchTasksError) throw fetchTasksError;

          const taskIdsToDelete = allTasks
            .filter(t => Array.isArray(t.tags) && t.tags.some(id => targetTagIds.includes(id)))
            .map(t => t.id);

          if (taskIdsToDelete.length > 0) {
            const { error: deleteTasksError } = await supabase
              .from('Task')
              .delete()
              .in('id', taskIdsToDelete);

            if (deleteTasksError) throw deleteTasksError;
          }
        }
        
        await supabase
          .from('Tag')
          .delete()
          .eq('user_id', currentUserId)
          .eq('name', selectedTagToPurge);
      }

      setDbTags(prev => prev.filter(t => t !== selectedTagToPurge));
      setSelectedTagToPurge('');

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      alert(`Wiped out all tasks and tokens for "${selectedTagToPurge}" successfully!`);
    } catch (err) {
      console.error("Bulk tag deletion failure details:", err);
      alert("Failed to complete bulk task removal.");
    } finally {
      setPurgingTag(false);
    }
  };

  const handleToggleReminders = (val) => {
    setTaskReminders(val);
    localStorage.setItem('pref-task-reminders', String(val));
  };

  const handleToggleImportAlerts = (val) => {
    setImportAlerts(val);
    localStorage.setItem('pref-import-alerts', String(val));
  };

  const handleLandingPage = (val) => {
    setLandingPage(val);
    localStorage.setItem('pref-landing-page', val);
  };

  const handleExportCSV = () => {
    if (!tasks || tasks.length === 0) {
      alert("No active tasks found to export.");
      return;
    }
    const headers = ['Title', 'Status', 'Priority', 'Due Date', 'Notes'];
    const rows = tasks.map((t) => [
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.status || '',
      t.priority || '',
      t.due_date || '',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'syncora-tasks.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await supabase.from('Task').delete().eq('user_id', authUser.id);
      }
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Account delete execution fault:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto text-slate-100 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Settings Workspace</h2>
        <p className="text-sm text-slate-400 mt-0.5">Manage your account credentials, themes, and configuration assets.</p>
      </div>

      <Section icon={Shield} title="Account Credentials Profile">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-5 pb-2">
          <div className="w-16 h-16 rounded-full border border-slate-700 overflow-hidden bg-slate-950 flex items-center justify-center shrink-0 shadow-inner">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-slate-400">
                {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-200">{user?.full_name || 'Active Syncora User'}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => fileInputRef.current.click()} 
              disabled={uploading} 
              className="gap-2 mt-1.5 h-8 text-xs border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" /> : <Upload className="w-3.5 h-3.5 text-slate-400" />}
              {uploading ? 'Uploading avatar...' : 'Change Avatar Photo'}
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            {avatarError && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded mt-2 max-w-md">{avatarError}</p>}
          </div>
        </div>
      </Section>

      <Section icon={Bell} title="Notification Subscriptions">
        <SettingRow label="Task Alert Monitoring" description="Show critical approaching targets and deadlines inside your activity hub indicator panel.">
          <Switch checked={taskReminders} onCheckedChange={handleToggleReminders} />
        </SettingRow>
        <SettingRow label="Syllabus Extraction Popups" description="Show a dynamic alert banner the instant your syllabus spreadsheet AI parser ends its process execution.">
          <Switch checked={importAlerts} onCheckedChange={handleToggleImportAlerts} />
        </SettingRow>
      </Section>

      <Section icon={Sliders} title="Theme Visual Adjustments">
        <SettingRow label="Interface Visual Theme" description="Syncora is fully optimized for high-contrast dark mode to reduce eye strain.">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            Dark Mode Only (Default)
          </span>
        </SettingRow>
        <SettingRow label="Default Redirect Hub" description="Choose which default landing module route loads automatically upon initialization checkpoints.">
          <Select value={landingPage} onValueChange={handleLandingPage}>
            <SelectTrigger className="w-36 bg-slate-950 border-slate-800 text-slate-200 text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
              <SelectItem value="dashboard">Dashboard Overview</SelectItem>
              <SelectItem value="calendar">Calendar Agenda</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </Section>

      <Section icon={Database} title="Data Control & Integrity">
        <SettingRow 
          label="Bulk Delete by Tag" 
          description="Instantly wipe clear all imported schedule data attached to a specific class or folder."
        >
          <div className="flex items-center gap-2">
            <Select value={selectedTagToPurge} onValueChange={setSelectedTagToPurge}>
              <SelectTrigger className="w-36 bg-slate-950 border-slate-800 text-slate-200 text-xs h-8">
                <SelectValue placeholder="Select class tag..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                {dbTags.length === 0 ? (
                  <p className="text-[11px] text-slate-500 p-2 text-center">No tags found</p>
                ) : (
                  dbTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="destructive"
              onClick={handlePurgeTagTasks}
              disabled={purgingTag || !selectedTagToPurge}
              className="h-8 text-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/30 disabled:opacity-30"
            >
              {purgingTag ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              Purge
            </Button>
          </div>
        </SettingRow>

        <SettingRow label="Backup Matrix Data Row" description="Compress and save your entire workspace agenda task dataset directly into a structured CSV catalog.">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleExportCSV} 
            className="gap-2 h-8 text-xs border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Export Data Sheet
          </Button>
        </SettingRow>
        
        <SettingRow
          label="Purge User Storage Cache"
          description="Irreversibly vaporizes your active task rows and resets file configurations permanently."
        >
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="gap-2 h-8 text-xs bg-red-950 hover:bg-red-900 text-red-200 border border-red-800/40"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            {confirmDelete ? 'Confirm Global Reset' : 'Purge All Task Data'}
          </Button>
        </SettingRow>
        {confirmDelete && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded font-medium mt-1 animate-pulse">
            Warning: Selecting confirmation triggers an irreversible database data drop command row. Proceed with caution.
          </p>
        )}
      </Section>

      <div className="pt-2 pb-8">
        <Button
          variant="outline"
          className="w-full gap-2 text-xs h-9 border-slate-800 bg-slate-900 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
          onClick={() => supabase.auth.signOut()}
        >
          <LogOut className="w-3.5 h-3.5" />
          Disconnect Account Profile
        </Button>
      </div>
    </div>
  );
}