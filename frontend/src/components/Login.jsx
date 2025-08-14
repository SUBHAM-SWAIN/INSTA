import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function Login() {
  const { login } = useContext(UserContext); // ✅ use login instead of setUser

  const [formData, setFormData] = useState({
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
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formData,
        {
          withCredentials: true,
        }
      );

      const user = res.data.user;

      // ✅ Ensure a default profilePic if none is provided
      if (!user.profilePic) {
        user.profilePic = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
      }

      login(user); // ✅ set user in context and localStorage
      toast.success(res.data.message);
      navigate("/");

      setFormData({ email: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-sm bg-white border border-gray-300 p-8 rounded-md shadow-[4px_4px_10px_rgba(0,0,0,0.1)]">
        <h1 className="text-4xl font-bold text-center font-sans mb-6 text-gray-800">
          Instagram
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
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
              "Log In"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-500 cursor-pointer">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
