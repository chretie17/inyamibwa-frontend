import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api';
import iyamibwaBackground from '../assets/inyamibwa.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      const { userId, userRole, token } = response.data;

      localStorage.setItem('userId', userId);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('token', token);

      if (userRole === 'admin' || userRole === 'trainer') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat p-6"
      style={{ backgroundImage: `url(${iyamibwaBackground})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 to-amber-700/50 backdrop-blur-sm" />

      {/* Login Container */}
      <div className="relative w-full max-w-lg mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-xl p-8 backdrop-blur-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-amber-900">
              Inyamibwa TROUPE
            </h1>
            <div className="w-16 h-0.5 bg-amber-900/60 mx-auto my-4" />
            <p className="text-amber-800 text-lg">
              Welcome back! Please log in to continue.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-amber-200 
                  focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 
                  bg-white/90 transition-all duration-200"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 
                    focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 
                    bg-white/90 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-900/50 
                    hover:text-amber-900 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 
                px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-900 to-amber-700 text-white 
                font-semibold py-4 px-6 rounded-lg uppercase tracking-wide
                hover:from-amber-800 hover:to-amber-600
                transform transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading && (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <span>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </span>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;