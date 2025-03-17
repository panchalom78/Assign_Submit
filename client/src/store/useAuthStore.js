import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
    user: null,
    login: async (data) => {
        try {
            const response = await axiosInstance.post("/user/login", data);
            set({ user: response.data });
            toast.success("Login successfully");
            return;
        } catch (error) {
            console.log(error.response.message);
            toast.error(error.response.message);
        }
    },
    signin: async (data) => {
        try {
            const response = await axiosInstance.post("/user", data);
            set({ user: response.data });
            toast.success("Signin successfully");
            return;
        } catch (error) {
            console.log(error.response.message);
            toast.error(error.response.message);
        }
    },
}));
