import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (formData) => {
        set({ isLoading: true, error: null });

        const email = formData.get("email");
        const password = formData.get("password");
        try {
          const res = await api.post("/auth/login", { email, password });
          if (res.data.success) {
            set({
              user: res.data.user,
              isAuthenticated: true,
            });
            toast.success("Connexion réussie !", { id: "Login success" });
            return res.data;
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Erreur de connexion", {
            id: "Login error",
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
          toast.error(
            error.response?.data?.message || "Erreur lors du deconnexion",
            {
              id: "logout error",
            }
          );
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
          });
          toast.error(error.response?.data?.message || "Erreur de connexion", {
            id: "getProlif error",
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
