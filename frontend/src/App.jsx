import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EntryPage from './pages/entry/EntryPage';
import CustomerLayout from './layouts/CustomerLayout';
import StorefrontPage from './pages/customer/StorefrontPage';
import PortalPlaceholder from './pages/common/PortalPlaceholder';

/**
 * App Component - Root Application & Routing Configuration
 * 
 * Maps directly to the project flowchart:
 * 
 *   [A: ShopSphere Entry] -> [B: User Type]
 *                               ├── [C: Customer]  -> /store (CustomerLayout Shell)
 *                               ├── [D: Seller]    -> /seller/dashboard, /seller/register
 *                               └── [E: Admin]     -> /admin/dashboard, /admin/login
 */
export default function App() {
  return (
    <Routes>
      {/* -----------------------------------------------------------------------
          ENTRY POINT (Flowchart Step A -> B)
          The landing page where user chooses Customer, Seller, or Admin portal.
         ----------------------------------------------------------------------- */}
      <Route path="/" element={<EntryPage />} />

      {/* -----------------------------------------------------------------------
          CUSTOMER BRANCH (Flowchart Step C) - Wrapped in CustomerLayout Shell!
          All routes here automatically render Navbar on top and Footer at bottom.
         ----------------------------------------------------------------------- */}
      <Route element={<CustomerLayout />}>
        {/* /store : Storefront with hero banner, categories, and auth status */}
        <Route path="/store" element={<StorefrontPage />} />

        {/* /cart : Shopping cart view (upcoming in FE-US-06) */}
        <Route 
          path="/cart" 
          element={
            <PortalPlaceholder 
              portalName="Shopping Cart" 
              description="Review selected items, update quantities, and see seller groupings." 
              nextStep="Cart items table, quantity incrementor, and price breakdown."
            />
          } 
        />
      </Route>

      {/* -----------------------------------------------------------------------
          CUSTOMER AUTHENTICATION (Flowchart Step F)
          Upcoming in FE-US-02 (Login and Register Forms)
         ----------------------------------------------------------------------- */}
      <Route 
        path="/login" 
        element={
          <PortalPlaceholder 
            portalName="Customer Sign In" 
            description="Login with email and password to receive JWT token." 
            nextStep="FE-US-02: Customer Login form with Axios connection to /api/v1/auth/login."
          />
        } 
      />
      <Route 
        path="/register" 
        element={
          <PortalPlaceholder 
            portalName="Customer Registration" 
            description="Create a new customer account." 
            nextStep="FE-US-02: Customer Register form with validation and automatic login."
          />
        } 
      />

      {/* -----------------------------------------------------------------------
          SELLER BRANCH (Flowchart Step D)
         ----------------------------------------------------------------------- */}
      <Route 
        path="/seller/dashboard" 
        element={
          <PortalPlaceholder 
            portalName="Seller Central Dashboard" 
            description="Seller portal for adding products, managing stock, and viewing incoming orders." 
            nextStep="Seller inventory table and order dispatch workflows."
          />
        } 
      />
      <Route 
        path="/seller/register" 
        element={
          <PortalPlaceholder 
            portalName="Seller Registration" 
            description="Seller onboarding form to set up store name, business details, and payout accounts." 
            nextStep="Multi-step seller onboarding form."
          />
        } 
      />

      {/* -----------------------------------------------------------------------
          ADMIN BRANCH (Flowchart Step E)
         ----------------------------------------------------------------------- */}
      <Route 
        path="/admin/dashboard" 
        element={
          <PortalPlaceholder 
            portalName="Admin Console" 
            description="System administration: reviewing sellers, moderating products, and checking platform logs." 
            nextStep="Admin analytics, user list, and approval tables."
          />
        } 
      />
      <Route 
        path="/admin/login" 
        element={
          <PortalPlaceholder 
            portalName="Admin Login" 
            description="Restricted login endpoint for platform administrators." 
            nextStep="Admin credential authentication."
          />
        } 
      />

      {/* -----------------------------------------------------------------------
          FALLBACK ROUTE
         ----------------------------------------------------------------------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
