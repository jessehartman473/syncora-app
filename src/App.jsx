import { useEffect } from 'react';
import { useQueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from "@/components/ui/toaster";
import { supabase } from './api/base44Client';

// Layout & Navigation Imports
import AppLayout from './components/layout/AppLayout';
import PageNotFound from './lib/PageNotFound';

// Page Component Imports
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import CalendarView from './pages/CalendarView';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Pure Supabase real-time sync engine
  useEffect(() => {
    // Only set up real-time sync if the user is logged in
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Task' }, 
        (payload) => {
          console.log('Realtime database update received:', payload);
          // Auto-refresh the frontend UI queries when data changes
          queryClient.invalidateQueries();
        }
      )
      .subscribe();

    // Clean up real-time listener when logging out or closing the tab
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, queryClient]);

  // Show loading spinner while checking auth status
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If the user is not logged in, show the Login screen directly
  if (!isAuthenticated) {
    return <Login />;
  }

  // Render the main app when successfully authenticated
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/board" element={<Board />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClientInstance}>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <AuthenticatedApp />
              <Toaster />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;