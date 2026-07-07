import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: () => void;
  logout: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));
