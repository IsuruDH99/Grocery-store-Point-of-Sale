import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserReg = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    jobrole: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.jobrole) {
      newErrors.jobrole = 'Job role is required';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/login/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitted(true);
          setFormData({ email: '', password: '', jobrole: '' });

          setTimeout(() => {
            // navigate('/Login');
          }, 1000);
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Something went wrong. Try again.');
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pb-32">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">User Registration</h2>

        {submitted && (
          <p className="text-green-600 text-center mb-4 animate-pulse">
            Registration successful! Redirecting...
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Job Role */}
          <div className="mb-6 bg-">
            <label className="block text-gray-700 font-medium mb-1">Job Role</label>
            <select
              name="jobrole"
              value={formData.jobrole}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.jobrole ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">-- Select Job Role --</option>
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
            </select>
            {errors.jobrole && <p className="text-red-500 text-sm mt-1">{errors.jobrole}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-black py-2 rounded-md font-semibold transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserReg;
