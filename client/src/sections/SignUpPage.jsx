import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

function Signup() {
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        password: "",
        prn: "",
        role: "Student",
    });
    const { signin } = useAuthStore();
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
            await signin({
                email: formData.email,
                name: formData.fullName,
                password: formData.password,
                role: formData.role,
            });
            navigate("/home");
        } catch (error) {
            console.log(error);
        }
        // Add form submission logic here
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

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
                    <label className="block text-gray-700">PRN Number</label>
                    <input
                        type="text"
                        name="prn"
                        value={formData.prn}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        pattern="\d{10}"
                        title="PRN number must be 10 digits long"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
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
