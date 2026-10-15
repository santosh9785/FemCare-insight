import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

// Real client or mock fallback client to guarantee 0 runtime crashes
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signUp: async ({ email, password, options }) => {
          console.info('[Supabase Fallback] Demo mode active. Registering locally...');
          return {
            data: {
              user: {
                id: 'user-demo-' + Math.random().toString(36).substring(2, 9),
                email,
                user_metadata: options?.data || {}
              }
            },
            error: null
          };
        },
        signInWithPassword: async ({ email, password }) => {
          console.info('[Supabase Fallback] Demo mode login...');
          return {
            data: {
              user: {
                id: 'user-demo-priya',
                email: email || 'priya@sahaaya.demo',
                user_metadata: { display_name: 'Priya Sharma', preferred_language: 'en' }
              }
            },
            error: null
          };
        },
        signOut: async () => ({ error: null }),
        getUser: async () => ({
          data: {
            user: {
              id: 'user-demo-priya',
              email: 'priya@sahaaya.demo',
              user_metadata: { display_name: 'Priya Sharma', preferred_language: 'en' }
            }
          },
          error: null
        })
      },
      from: (table) => ({
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        insert: (data) => Promise.resolve({ data, error: null }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null })
        })
      })
    };
