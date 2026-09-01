import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/auth';

// Persisted to localStorage so a refresh doesn't log the user out.
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,

      login: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.login(email);
          set({ token: data.access_token, user: data.user, isLoading: false });
          return true;
        } catch (err) {
          set({ error: err.message || 'Login failed', isLoading: false });
          return false;
        }
      },

      logout: () => set({ token: null, user: null }),
    }),
    { name: 'visitbih-auth' }
  )
);
