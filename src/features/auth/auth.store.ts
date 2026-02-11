import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAccessToken, removeAccessToken } from '@/shared/api';

interface User {
  id: number;
  name?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (memberId: number, accessToken: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (memberId: number, accessToken: string) => {
        setAccessToken(accessToken);
        set({
          user: { id: memberId },
          isAuthenticated: true,
        });
      },
      logout: () => {
        removeAccessToken();
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
