// src/store/posStore.js
import { create } from "zustand";
import api from "../lib/axios";

export const usePOSStore = create((set) => ({
  pointsOfSale: [],
  currentPOS: null,
  isLoading: false,
  error: null,

  fetchPointsOfSale: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/pos");
      if (response.data.success) {
        set({ pointsOfSale: response.data.pointsOfSales, isLoading: false });
      }
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  createPOS: async (posData) => {
    try {
      const response = await api.post("/pos", posData);
      if (response.data.success) {
        set((state) => ({
          pointsOfSale: [...state.pointsOfSale, response.data.pointOfSale],
        }));
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  updatePOS: async (id, posData) => {
    try {
      const response = await api.put(`/pos/${id}`, posData);
      if (response.data.success) {
        set((state) => ({
          pointsOfSale: state.pointsOfSale.map((pos) =>
            pos._id === id ? response.data.pointOfSale : pos
          ),
        }));
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  deletePOS: async (id) => {
    try {
      const response = await api.delete(`/pos/${id}`);
      if (response.data.success) {
        set((state) => ({
          pointsOfSale: state.pointsOfSale.filter((pos) => pos._id !== id),
        }));
      }
    } catch (error) {
      throw error;
    }
  },

  getPOSStats: async (id, params) => {
    try {
      const response = await api.get(`/pos/${id}/stats`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));
