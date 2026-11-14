import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-8 text-sm text-gray-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">ShopSphere</span>
                    <span>•</span>
                    <span>Multi-Vendor E-Commerce Platform</span>
                </div>

                <div className="flex items-center gap-6 text-xs text-gray-500">
                    <Link to="/seller/register" className="hover:text-gray-900 transition">
                        Sell on ShopSphere
                    </Link>
                    <Link to="/admin/login" className="hover:text-gray-900 transition">
                        Admin Portal
                    </Link>
                    <span>© {new Date().getFullYear()} ShopSphere Inc.</span>
                </div>
            </div>
        </footer>
    );
}