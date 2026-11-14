import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginPage Component
 * 
 * Allows customers to authenticate using their email and password.
 * On success, invokes login() from AuthContext and navigates to the storefront.
 */
export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form input states
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // UI status states
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error as soon as user starts re-typing
        if (error) setError('');
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Call Spring Boot backend endpoint
            const response = await api.post('/auth/login', {
                email: formData.email.trim(),
                password: formData.password,
            });

            // 2. Save token and user info into AuthContext & localStorage
            login(response.data);

            // 3. Redirect user into the customer storefront
            navigate('/store');
        } catch (err) {
            // Handle HTTP 401 / 403 / 500 errors
            const serverMessage = err.response?.data?.message || 'Invalid email or password. Please try again.';
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

            {/* Top back link to Gateway */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 px-4 sm:px-0">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Portal Selection</span>
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Brand header */}
                <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-gray-900 text-white mx-auto flex items-center justify-center font-bold text-base mb-3 shadow-sm">
                        S
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Sign in to ShopSphere
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Welcome back! Access your cart, orders, and saved addresses.
                    </p>
                </div>

                {/* Card Form */}
                <div className="mt-8 bg-white py-8 px-6 sm:px-10 border border-gray-200 rounded-2xl shadow-sm">

                    {/* Error Alert Box */}
                    {error && (
                        <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs leading-relaxed">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:bg-white transition"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-gray-700">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:bg-white transition"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 shadow-sm"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Navigation to Register */}
                    <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-600">
                        Don't have an account yet?{' '}
                        <Link to="/register" className="font-semibold text-gray-900 hover:underline">
                            Create an account
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}