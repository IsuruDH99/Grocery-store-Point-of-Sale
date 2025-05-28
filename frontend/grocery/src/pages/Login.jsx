import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../Images/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Toast notification functions
  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login/logindata", {
        email,
        password,
      });
      localStorage.setItem("accessToken", response.data.token);
      if (response.status === 200) {
        showSuccess("Successfully Login");
        setMessage("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.error || "Login failed";
        setMessage(errorMsg);
        showError(errorMsg);
      } else {
        setMessage("Server error");
        showError("Server error");
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login/reset-password", {
        email,
        newPassword,
      });
      
      if (response.status === 200) {
        showSuccess("Password changed successfully");
        setShowForgotPassword(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.error || "Password reset failed";
        showError(errorMsg);
      } else {
        showError("Server error");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Background Image */}
      <div className="w-1/2 hidden lg:block">
        <img
          src={loginImage}
          alt="Login Visual"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 mb-16">
        <div className="w-full max-w-md bg-gray-200 rounded-lg shadow-lg pt-16 pb-20 px-3">
          <h2 className="text-2xl font-bold mb-16 text-blue-500 text-center pb-4">
            {showForgotPassword ? "Reset Password" : "User Login"}
          </h2>

          {message && (
            <p className="text-center text-sm text-red-600 mb-4">{message}</p>
          )}

          {showForgotPassword ? (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-600"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-600"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 pb-2 mb-2"
              >
                Reset Password
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-blue-600 text-sm hover:underline text-center"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Login
                </button>
              </form>

              {/* Forgot Password Link */}
              <button
                onClick={() => setShowForgotPassword(true)}
                className="mt-4 text-blue-600 text-sm hover:underline w-full text-center"
              >
                Change or Forgot Password?
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;