import { create } from "zustand";
import api from "../lib/axios";

export const usePlanStore = create((set) => ({
  plans: [],
  isLoading: false,
  error: null,

  fetchPlans: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/plans");
      if (response.data.success) {
        set({ plans: response.data.plans, isLoading: false });
      }
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  createPlan: async (planData) => {
    try {
      const response = await api.post("/plans", planData);
      if (response.data.success) {
        set((state) => ({
          plans: [...state.plans, response.data.plan],
        }));
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  updatePlan: async (id, planData) => {
    try {
      const response = await api.put(`/plans/${id}`, planData);
      if (response.data.success) {
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan._id === id ? response.data.plan : plan
          ),
        }));
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  deletePlan: async (id) => {
    try {
      const response = await api.delete(`/plans/${id}`);
      if (response.data.success) {
        set((state) => ({
          plans: state.plans.filter((plan) => plan._id !== id),
        }));
      }
    } catch (error) {
      throw error;
    }
  },
}));
