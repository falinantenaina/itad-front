import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/axios";


export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null})
                try {
                    const res = await api.post('/auth/login', {email, password})
                    if(res.data.success) {
                        set({
                            user: res.data.user,
                            isAuthenticated: true
                        })
                    }
                } catch (error) {
                    set({
                        error: error.response?.data?.message
                        })
                } finally {
                    set({
                        isLoading: false
                    })
                }
            }
        })
    )
)