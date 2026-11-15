import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';

/**
 * StorefrontPage Component (FE-US-03)
 * 
 * Customer marketplace homepage featuring:
 * - Dynamic category navigation pills from /api/v1/categories/tree
 * - Featured products grid from /api/v1/products/featured
 * - Multi-vendor value propositions & trust badges
 */
export default function StorefrontPage() {
  const { user, isAuthenticated } = useAuth();

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch categories and featured products in parallel from backend APIs
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories/tree'),
          api.get('/products/featured'),
        ]);

        setCategories(catRes.data);
        setFeaturedProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to load storefront data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Welcome Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
            Verified Multi-Vendor Marketplace
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
            <Link
              to="/products"
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
            >
              <span>Browse All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {!isAuthenticated && (
              <Link
                to="/register"
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Explore by Department</h2>
          <Link to="/products" className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="h-28 flex items-center justify-center text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading departments...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all group"
              >
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-gray-700">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {cat.description || `${cat.subCategories?.length || 0} subcategories`}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Featured Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-xs text-gray-500 mt-0.5">Handpicked trending items from verified sellers</p>
          </div>
          <Link to="/products" className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <span>See more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading featured catalog...
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm bg-white rounded-xl border border-gray-200">
            No featured products currently available.
          </div>
        )}
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200 text-center">
        <div className="flex flex-col items-center space-y-2 p-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900">Multi-Vendor Fulfillment</h4>
          <p className="text-xs text-gray-500 max-w-xs">Direct dispatch from independent, verified merchants.</p>
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
