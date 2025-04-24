import React, { useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";

function Signup() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "student",
        prn:""

    });
    const { setUser } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(
                "/auth/register",
                {
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                },
                { withCredentials: true }
            );

            console.log("Signup successful:", response.data);
            alert("Signup Successful!");
            setUser(response.data.user);
            navigate("/select-affiliate"); // Redirect user after successful signup
        } catch (error) {
            console.error(
                "Signup failed:",
                error.response?.data || error.message
            );
            alert(
                error.response?.data?.error ||
                    "Signup failed. Please try again."
            );
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

                <div className="mb-4">
                    <label className="block text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default Signup;
