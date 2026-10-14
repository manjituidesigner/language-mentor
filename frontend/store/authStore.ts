import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  proficiency_level?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  token: string | null;
  user: User | null;
  login: (token?: string, user?: User) => void;
  logout: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      token: null,
      user: null,
      login: (token, user) =>
        set({
          isAuthenticated: true,
          token: token || 'demo_development_token_2026',
          user: user || {
            id: '00000000-0000-0000-0000-000000000001',
            email: 'demo@lumina.mentor',
            name: 'Demo Student',
          },
        }),
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
