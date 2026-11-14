import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * StorefrontPage Component
 * 
 * The default landing page for customers inside the CustomerLayout shell.
 * Displays banner, category quick links, and platform value props.
 */
export default function StorefrontPage() {
  const { user, isAuthenticated } = useAuth();

  const categories = [
    { name: 'Electronics', count: '1,200+ items' },
    { name: 'Fashion & Apparel', count: '3,400+ items' },
    { name: 'Home & Kitchen', count: '850+ items' },
    { name: 'Beauty & Health', count: '620+ items' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Welcome Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
            Customer Storefront Active
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Discover Multi-Vendor Products in One Marketplace.
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            {isAuthenticated ? (
              <span>Welcome back, <strong className="text-gray-900">{user?.firstName}</strong>! Your persistent session and cart are active.</span>
            ) : (
              <span>Browse thousands of verified products from independent vendors. Sign in to start adding items to your cart.</span>
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  <span>Sign In to Your Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition"
                >
                  Create an Account
                </Link>
              </>
            ) : (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-lg font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Logged in as: {user?.email} ({user?.role})
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Category Quick Pills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Explore by Department</h2>
          <span className="text-xs text-gray-500">Upcoming in BE-US-04 & FE-US-04</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200 text-center">
        <div className="flex flex-col items-center space-y-2 p-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900">Multi-Vendor Fulfillment</h4>
          <p className="text-xs text-gray-500 max-w-xs">Direct dispatch from verified independent merchants.</p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900">Zero-Trust Security</h4>
          <p className="text-xs text-gray-500 max-w-xs">Stateless JWT session tokens and BCrypt password encryption.</p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900">Milestone Tracking</h4>
          <p className="text-xs text-gray-500 max-w-xs">Live step-by-step parcel updates from pickup to delivery.</p>
        </div>
      </div>

    </div>
  );
}

