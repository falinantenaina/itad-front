import { create } from "zustand";
import api from "../lib/axios";

export const useCashierStore = create((set) => ({
  cashiers: [],
  isLoading: false,
  error: null,

  fetchCashiers: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/cashier");
      if (response.data.success) {
        set({ cashiers: response.data.cashiers, isLoading: false });
      }
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  createCashier: async (cashierData) => {
    try {
      const response = await api.post("/cashier", cashierData);
      if (response.data.success) {
        set((state) => ({
          cashiers: [...state.cashiers, response.data.cashier],
        }));
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  updateCashier: async (id, cashierData) => {
    try {
      const response = await api.put(`/cashier/${id}`, cashierData);
      if (response.data.success) {
        set((state) => ({
          cashiers: state.cashiers.map((cashier) =>
            cashier._id === id ? response.data.cashier : cashier
          ),
        }));
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  deleteCashier: async (id) => {
    try {
      const response = await api.delete(`/cashier/${id}`);
      if (response.data.success) {
        set((state) => ({
          cashiers: state.cashiers.filter((cashier) => cashier._id !== id),
        }));
      }
    } catch (error) {
      throw error;
    }
  },
}));
