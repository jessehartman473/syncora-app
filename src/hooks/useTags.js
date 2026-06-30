import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../api/base44Client';

export function useTags() {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['Tag'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: tags, error } = await supabase
        .from('Tag')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      return tags || [];
    },
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: async ({ name, color }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User session not found");

      const newTagPayload = {
        name,
        color,
        user_id: user.id
      };

      const { data: createdRecord, error } = await supabase
        .from('Tag')
        .insert([newTagPayload])
        .select()
        .maybeSingle(); // 🌟 More resilient than .single() if matching rules tweak

      if (error) throw error;
      return createdRecord;
    },
    onSuccess: () => {
      // Instantly forces TagPicker to redraw its choices list!
      queryClient.invalidateQueries({ queryKey: ['Tag'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (tagId) => {
      const { error } = await supabase
        .from('Tag')
        .delete()
        .eq('id', tagId);

      if (error) throw error;
      return tagId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Tag'] });
    },
  });

  return {
    data,
    isLoading,
    createTag: async (name, color) => {
      return await createMutation.mutateAsync({ name, color });
    },
    deleteTag: async (tagId) => {
      return await deleteMutation.mutateAsync(tagId);
    },
  };
}