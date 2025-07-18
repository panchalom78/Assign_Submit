import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiLoader } from "react-icons/fi";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuthStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post("/auth/login", formData, {
                withCredentials: true,
            });
            setUser(response.data.user);
            console.log("Login successful:", response.data);
            navigate("/dashboard");
        } catch (error) {
            console.error(
                "Login failed:",
                error.response?.data || error.message
            );
            setError(
                error.response?.data?.error || "Invalid email or password"
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const buttonHover = {
        scale: 1.02,
        boxShadow: "0 5px 15px rgba(235, 54, 120, 0.4)",
    };

    const buttonTap = {
        scale: 0.98,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-md"
            >
                <div className="bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-[#EB3678]/20">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-[#EB3678] to-[#FB773C] p-6 text-center">
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-bold text-white"
                        >
                            Welcome Back
                        </motion.h2>
                        <motion.p
                            variants={itemVariants}
                            className="text-white/80 mt-2"
                        >
                            Sign in to your AssignMate account
                        </motion.p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-900/20 text-red-300 border border-red-500/30 p-3 rounded-lg flex items-center"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                {error}
                            </motion.div>
                        )}

                        <motion.div
                            variants={itemVariants}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-[#EB3678] focus:border-[#EB3678] text-white placeholder-gray-400 transition"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-[#EB3678] focus:border-[#EB3678] text-white placeholder-gray-400 transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#EB3678] focus:ring-[#EB3678] border-gray-500 rounded bg-gray-700"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-300"
                                >
                                    Remember me
                                </label>
                            </div>

                            {/* <div className="text-sm">
                                <a href="#" className="font-medium text-[#FB773C] hover:text-[#EB3678]">
                                    Forgot password?
                                </a>
                            </div> */}
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={buttonHover}
                            whileTap={buttonTap}
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#EB3678] to-[#FB773C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB3678] transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="animate-spin h-5 w-5 mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In <FiArrowRight className="ml-2" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <motion.div
                        variants={itemVariants}
                        className="px-8 pb-6 text-center"
                    >
                        <p className="text-sm text-gray-400">
                            Don't have an account?{" "}
                            <button
                                onClick={() => navigate("/signup")}
                                className="font-medium text-[#FB773C] hover:text-[#EB3678]"
                            >
                                Sign up
                            </button>
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="mt-6 text-center text-sm text-gray-400"
                >
                    <p>
                        © {new Date().getFullYear()} AssignMate. All rights
                        reserved.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Login;
