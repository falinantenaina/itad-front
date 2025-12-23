// src/store/saleStore.js
import { create } from "zustand";
import api from "../lib/axios";

export const useSaleStore = create((set) => ({
  sales: [], // ✅ Initialiser comme tableau vide
  stats: null,
  isLoading: false,
  error: null,

  fetchSalesHistory: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get("/sales/history", { params });
      if (response.data.success) {
        set({
          sales: response.data.sales || [], // ✅ Assurer qu'on a toujours un tableau
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message,
        sales: [], // ✅ Réinitialiser à un tableau vide en cas d'erreur
        isLoading: false,
      });
    }
  },

  fetchSalesStats: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get("/sales/stats", { params });
      if (response.data.success) {
        set({ stats: response.data, isLoading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message,
        isLoading: false,
      });
    }
  },

  getCashierStats: async (params = {}) => {
    try {
      const response = await api.get("/sales/cashier-stats", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));
