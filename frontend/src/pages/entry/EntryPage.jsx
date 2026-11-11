import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Store, Shield, ArrowRight } from 'lucide-react';

/**
 * EntryPage Component
 * 
 * This is the landing/entry point of the ShopSphere application.
 * Corresponds to Step A -> B in the flowchart:
 *   [A: ShopSphere Entry] -> [B: User Type Decision]
 * 
 * From here, users route into one of three distinct system flows:
 *   1. Customer: Browsing, purchasing, and order tracking
 *   2. Seller: Product management, inventory control, and sales analytics
 *   3. Admin: Platform governance, seller KYC, and system oversight
 */
export default function EntryPage() {
  // Hook from react-router-dom to programmatically redirect the user to selected routes
  const navigate = useNavigate();

  /**
   * Portal configuration list
   * Each object contains the display data, icons, and routing actions
   * for each of the three user roles.
   */
  const portals = [
    {
      id: 'customer',
      role: 'Customer',
      title: 'Customer Storefront',
      description: 'Browse multi-vendor products, manage your cart, place orders, and track deliveries.',
      icon: ShoppingBag,
      features: [
        'Search & filter products by category and brand',
        'Multi-variant selection (size, color, SKU)',
        'Order placement & live milestone tracking'
      ],
      // Main action navigates to customer login/store
      primaryActionText: 'Continue as Customer',
      onPrimaryClick: () => navigate('/store'),
      secondaryActionText: 'Sign In / Register',
      onSecondaryClick: () => navigate('/login?role=customer'),
    },
    {
      id: 'seller',
      role: 'Seller',
      title: 'Seller Central',
      description: 'Manage your product listings, track inventory levels, dispatch orders, and view payouts.',
      icon: Store,
      features: [
        'Add & update products with pricing and stock',
        'Process customer orders and manage shipments',
        'Monitor store revenue and profit analytics'
      ],
      // Main action navigates to seller dashboard
      primaryActionText: 'Continue as Seller',
      onPrimaryClick: () => navigate('/seller/dashboard'),
      secondaryActionText: 'Register as a Seller',
      onSecondaryClick: () => navigate('/seller/register'),
    },
    {
      id: 'admin',
      role: 'Admin',
      title: 'Admin Console',
      description: 'Manage the overall platform: verify seller accounts, moderate listings, and review system logs.',
      icon: Shield,
      features: [
        'Approve or reject seller registrations (KYC)',
        'Platform-wide product and order moderation',
        'Financial settlements and system health logs'
      ],
      // Main action navigates to admin portal
      primaryActionText: 'Continue as Admin',
      onPrimaryClick: () => navigate('/admin/dashboard'),
      secondaryActionText: 'Admin Login',
      onSecondaryClick: () => navigate('/admin/login'),
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
      
      {/* =========================================================================
          TOP NAVIGATION BAR
          Displays platform name and minimal system status indicator
         ========================================================================= */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Simple logo mark */}
            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">ShopSphere</span>
              <span className="text-xs text-gray-500 ml-2 hidden sm:inline">Multi-Vendor E-Commerce</span>
            </div>
          </div>

          {/* Simple status badge */}
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            System Online
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO & PORTAL SELECTION
          Clean, neutral layout allowing user to select their role
         ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
        
        {/* Header text */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Select Your Portal
          </h1>
          <p className="text-base text-gray-600">
            Welcome to ShopSphere. Please select how you want to use the platform today.
          </p>
        </div>

        {/* 3 Portal Cards: Customer, Seller, Admin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between hover:border-gray-400 transition-colors shadow-sm"
              >
                <div>
                  {/* Role Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {portal.role}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {portal.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                    {portal.description}
                  </p>

                  {/* Bullet points explaining what happens in this portal */}
                  <ul className="space-y-2 mb-6 pt-4 border-t border-gray-100">
                    {portal.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  {/* Primary Button */}
                  <button
                    onClick={portal.onPrimaryClick}
                    className="w-full py-2.5 px-4 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    <span>{portal.primaryActionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Secondary Link / Button */}
                  <button
                    onClick={portal.onSecondaryClick}
                    className="w-full py-2 px-4 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
                  >
                    {portal.secondaryActionText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* =========================================================================
          FOOTER
          Standard clean footer with copyright and project information
         ========================================================================= */}
      <footer className="bg-white border-t border-gray-200 py-6 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
          <p className="text-gray-400">Spring Boot 3 + MySQL + React 18</p>
        </div>
      </footer>

    </div>
  );
}
