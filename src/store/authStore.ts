import { create } from "zustand";
import { secureStorage } from "@/services/storage/secureStore";
import { delay } from "@/utils/helpers";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  hydrate: async () => {
    try {
      const token = await secureStorage.getToken();
      const userData = await secureStorage.getUser();
      if (token && userData) {
        const user = JSON.parse(userData) as User;
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  login: async (email: string, _password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock auth - simulates network delay
      await delay(1000);

      const mockUser: User = {
        id: "user_1",
        name: email.split("@")[0],
        email,
      };
      const mockToken = `mock_jwt_${Date.now()}`;

      await secureStorage.setToken(mockToken);
      await secureStorage.setUser(JSON.stringify(mockUser));

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      });
    }
  },

  register: async (name: string, email: string, _password: string) => {
    set({ isLoading: true, error: null });
    try {
      await delay(1200);

      const mockUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
      };
      const mockToken = `mock_jwt_${Date.now()}`;

      await secureStorage.setToken(mockToken);
      await secureStorage.setUser(JSON.stringify(mockUser));

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Registration failed",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    await secureStorage.clearAll();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));
