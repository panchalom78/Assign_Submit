import React, { useState } from "react";
import axios from "axios";
<<<<<<< HEAD
=======
import axiosInstance from "../utils/axiosInstance";
>>>>>>> 8e8dbccb811dfcff487ed8b5660fb9b33b6038a9
import { useNavigate } from "react-router";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5134/api/auth/login",
        formData,
        {
          withCredentials: true, // Ensure the cookie is set by the backend
=======
    const [error, setError] = useState(null); // Track login errors
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
            const response = await axiosInstance.post("/auth/login", formData);

            console.log("Login successful:", response.data);
            navigate("/home");
        } catch (error) {
            console.error(
                "Login failed:",
                error.response?.data || error.message
            );
            setError(
                error.response?.data?.error || "Invalid email or password"
            );
>>>>>>> 8e8dbccb811dfcff487ed8b5660fb9b33b6038a9
        }
      );

      console.log("Login successful:", response.data);
      navigate("/select-affiliate");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Invalid email or password");
    }
  };

<<<<<<< HEAD
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
=======
                {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                )}
>>>>>>> 8e8dbccb811dfcff487ed8b5660fb9b33b6038a9

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;