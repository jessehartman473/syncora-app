import { createClient } from '@supabase/supabase-js';

const LIVE_URL = 'https://fbszoknzojgwllluqtry.supabase.co';
const LIVE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzYSIsInJlZiI6ImZic3pva256b2pnd2xsbHVxdHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MDk3MDIsImV4cCI6MjA5NjI4NTcwMn0.CR3fPve6LOT4WjPbbyzdgZNRPdpSwxF2_II0zeJuGnc';

// 1. Pure Supabase client initialization
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const getCurrentUserEmail = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user?.email ?? null;
};

const createEntityMethods = (tableName, options = {}) => ({
  filter: async (filter = {}) => {
    const { data, error } = await supabase.from(tableName).select('*').match(filter);
    if (error) throw error;
    return data || [];
  },
  create: async (payload) => {
    const record = { ...payload };
    if (options.addCreatedBy) {
      record.created_by = await getCurrentUserEmail();
    }
    const { data, error } = await supabase.from(tableName).insert([record]).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id, payload) => {
    const { data, error } = await supabase.from(tableName).update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { data, error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) throw error;
    return data;
  },
  bulkCreate: async (items) => {
    const records = options.addCreatedBy
      ? items.map((item) => ({ ...item, created_by: null }))
      : items;
    if (options.addCreatedBy) {
      const createdBy = await getCurrentUserEmail();
      records.forEach((record) => {
        record.created_by = createdBy;
      });
    }
    const { data, error } = await supabase.from(tableName).insert(records).select();
    if (error) throw error;
    return data;
  },
});

const base44 = {
  auth: {
    async me() {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
    async updateMe(updates) {
      const { data, error } = await supabase.auth.updateUser({ data: updates });
      if (error) throw error;
      return data;
    },
    async logout() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    redirectToLogin() {
      window.location.href = '/login';
    },
  },
  entities: {
    Task: createEntityMethods('Task', { addCreatedBy: true }),
    Tag: createEntityMethods('Tag', { addCreatedBy: true }),
  },
  integrations: {
    Core: {
      async UploadFile() {
        throw new Error('Base44 Core.UploadFile is unavailable in the current Supabase-only setup.');
      },
      async InvokeLLM() {
        throw new Error('Base44 Core.InvokeLLM is unavailable in the current Supabase-only setup.');
      },
    },
  },
};

export { base44 };
export default supabase;
