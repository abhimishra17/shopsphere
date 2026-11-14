import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * CustomerLayout wraps customer-facing pages.
 * <Outlet /> is a React Router placeholder that dynamically renders
 * whichever child route is currently active (Storefront, Cart, Checkout, etc.).
 */
export default function CustomerLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}