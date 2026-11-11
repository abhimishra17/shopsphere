import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EntryPage from './pages/entry/EntryPage';
import PortalPlaceholder from './pages/common/PortalPlaceholder';

/**
 * App Component - Root Application & Routing Configuration
 * 
 * Maps directly to the project flowchart:
 * 
 *   [A: ShopSphere Entry] -> [B: User Type]
 *                               ├── [C: Customer]  -> /store, /login
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
          CUSTOMER BRANCH (Flowchart Step C)
          Routes:
            - /store : Product catalog, categories, search, cart
            - /login : Customer login & registration (Step F in flowchart)
         ----------------------------------------------------------------------- */}
      <Route 
        path="/store" 
        element={
          <PortalPlaceholder 
            portalName="Customer Storefront" 
            description="The customer shopping catalog with search, filtering, product variants, and cart management." 
            nextStep="Product listings grid, category filters, and product details page."
          />
        } 
      />
      <Route 
        path="/login" 
        element={
          <PortalPlaceholder 
            portalName="Customer Authentication" 
            description="Login and registration for shoppers with email and password." 
            nextStep="Login/Register forms with JWT token handling."
          />
        } 
      />

      {/* -----------------------------------------------------------------------
          SELLER BRANCH (Flowchart Step D)
          Routes:
            - /seller/dashboard : Seller product management, inventory, and orders (Step Q)
            - /seller/register  : Merchant onboarding and KYC verification (Step P)
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
          Routes:
            - /admin/dashboard : Super-admin dashboard for user/seller moderation (Step W)
            - /admin/login     : Secure administrator login (Step V)
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
          Any unmatched route redirects back to the main Entry Page.
         ----------------------------------------------------------------------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
