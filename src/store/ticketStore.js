import { create } from "zustand";
import api from "../lib/axios";

export const useTicketStore = create((set) => ({
  currentTicket: null,
  isLoading: false,
  error: null,

  purchaseTicket: async (ticketData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/tickets/purchase", ticketData);
      if (response.data.success) {
        set({
          currentTicket: response.data.ticket,
          isLoading: false,
        });
        return response.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Erreur lors de l'achat",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyTicket: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/tickets/verify/${code}`);
      if (response.data.success) {
        set({ isLoading: false });
        return response.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Erreur de vérification",
        isLoading: false,
      });
      throw error;
    }
  },

  clearTicket: () => set({ currentTicket: null, error: null }),
}));
