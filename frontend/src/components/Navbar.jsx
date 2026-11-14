import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Brand Logo & Back to Gateway button */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            title="Return to Gateway"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>

                        <Link to="/store" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                                S
                            </div>
                            <span className="font-bold text-lg text-gray-900 tracking-tight">ShopSphere</span>
                        </Link>
                    </div>

                    {/* Search Bar Placeholder */}
                    <div className="flex-1 max-w-lg hidden md:block">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search products, brands, and categories..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    {/* Right Navigation Actions */}
                    <div className="flex items-center gap-4">

                        {/* Cart Icon with Counter Badge */}
                        <Link
                            to="/cart"
                            className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-4 h-4 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        <div className="h-5 w-px bg-gray-200"></div>

                        {/* Authentication Condition */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-semibold text-xs text-gray-800">
                                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden sm:inline font-medium">
                                        Hi, {user?.firstName}
                                    </span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    title="Sign Out"
                                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-3 py-1.5 rounded-lg transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </header>
    );
}