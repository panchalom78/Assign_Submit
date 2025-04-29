import { create } from "zustand";
import axiosInstance from "./axiosInstance";

const useAuthStore = create((set) => ({
    // User state
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Login function
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/auth/login", {
                email,
                password,
            });
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.Error || "Login failed",
                isLoading: false,
            });
            throw error;
        }
    },

    // Register function
    register: async (fullName, email, password, role) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/auth/register", {
                fullName,
                email,
                password,
                role,
            });
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.Error || "Registration failed",
                isLoading: false,
            });
            throw error;
        }
    },

    // Logout function
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post("/auth/logout");
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.Error || "Logout failed",
                isLoading: false,
            });
            throw error;
        }
    },

    // Get user details
    getUserDetails: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/auth/user");
            set({
                user: response.data,
                isAuthenticated: true,
                isLoading: false,
            });
            console.log(response.data);

            return response.data;
        } catch (error) {
            set({
                error:
                    error.response?.data?.Error || "Failed to get user details",
                isLoading: false,
            });
            throw error;
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(
                "/auth/update-profile",
                profileData
            );
            set({
                user: response.data,
                isLoading: false,
            });
            return response.data;
        } catch (error) {
            set({
                error:
                    error.response?.data?.Error || "Failed to update profile",
                isLoading: false,
            });
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Check auth status (useful for initial load and refreshing)
    checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/auth/verify-token");
            set({
                user: response.data,
                isAuthenticated: true,
                isLoading: false,
            });
            return response.data;
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
            });
        }
    },
}));

export default useAuthStore;
