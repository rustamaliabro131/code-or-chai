import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Login failed");
          }
          
          const data = await res.json();
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
          });
          
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Registration failed");
          }
          
          const data = await res.json();
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, token: null });
      },
      
      checkAuth: async () => {
        const { token } = get();
        if (!token) return;
        
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (res.ok) {
            const data = await res.json();
            set({ user: data.user });
          } else {
            set({ user: null, token: null });
          }
        } catch {
          set({ user: null, token: null });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
    }
  )
);