import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../api/base44Client';

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetches tasks that belong strictly to the current logged-in user
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      // Get current authenticated user session details
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('Task')
        .select('*')
        .eq('user_id', user.id) // 🔒 Ensures you only read YOUR tasks
        .order('id', { ascending: false });
        
      if (error) throw error;
      return data ?? [];
    },
    refetchOnWindowFocus: false,
  });

  // Inserts a new task automatically bound to the creator's ID
  const createTaskMutation = useMutation({
    mutationFn: async (taskData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User session not found");

      const payload = {
        ...taskData,
        user_id: user.id // 🔒 Explicitly tags the task row with your ID
      };

      const { data, error } = await supabase
        .from('Task')
        .insert([payload])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, taskData }) => {
      const { data, error } = await supabase
        .from('Task')
        .update(taskData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('Task')
        .delete().eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return {
    tasks,
    isLoading,
    error: error ? error.message : null,
    createTask: createTaskMutation.mutateAsync,
    updateTask: (id, data) => updateTaskMutation.mutateAsync({ id, taskData: data }),
    deleteTask: deleteTaskMutation.mutateAsync,
    refreshTasks: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  };
};

export default useTasks;