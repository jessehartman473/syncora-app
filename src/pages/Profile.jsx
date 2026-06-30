import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();

  // Supabase stores extra user info (like name) inside user_metadata
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Syncora User';

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">Your account details</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{displayName}</p>
          <p className="text-sm text-muted-foreground">{user?.email || 'Not logged in'}</p>
        </div>
        <div className="w-full border-t border-border pt-4 mt-2">
          <Button variant="destructive" className="w-full gap-2" onClick={() => logout()}>
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}