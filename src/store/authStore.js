import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/auth/login", { email, password });
          if (res.data.success) {
            set({
              user: res.data.user,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          set({
            error: error.response?.data?.message,
          });
        } finally {
          set({
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Logout error:", error);
        }
      },

      getProfile: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get("/auth/profil");
          if (res.data.success) {
            set({ user: res.date.user, isAuthenticated: true });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            error: error.response?.data?.message,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
