import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Fixed typo here

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      toast.success("Signup successful!");
      navigate("/"); // Redirect on success
      setFormData({ username: "", email: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center py-8">
      <div className="bg-white border border-gray-300 p-8 w-full max-w-sm rounded-md shadow-[4px_4px_10px_rgba(0,0,0,0.1)]">
        <h1 className="text-4xl font-bold text-center font-sans mb-6 tracking-wide text-gray-800">
          Instagram
        </h1>

        <p className="text-sm text-gray-500 text-center mb-4">
          Sign up to see photos and videos from your friends.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Mobile Number or Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 text-sm transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"
                ></path>
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <div className="w-full h-px bg-gray-300"></div>
          <span className="px-2 text-sm text-gray-500">OR</span>
          <div className="w-full h-px bg-gray-300"></div>
        </div>

        <p className="text-center text-xs text-gray-500">
          By signing up, you agree to our{" "}
          <span className="font-semibold">Terms</span>,{" "}
          <span className="font-semibold">Privacy Policy</span>, and{" "}
          <span className="font-semibold">Cookies Policy</span>.
        </p>
      </div>

      <div className="bg-white border border-gray-300 rounded-md mt-4 p-4 w-full max-w-sm text-center text-sm">
        Have an account?{" "}
        <Link
          to={"/login"}
          className="text-blue-500 font-semibold cursor-pointer"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
