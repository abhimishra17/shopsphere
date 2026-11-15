import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

/**
 * ProductCard Component
 * 
 * Reusable product display card used across the storefront homepage
 * and product discovery grid.
 * Displays primary image, brand, title, star rating, base price, and stock status.
 */
export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Product Thumbnail */}
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          {product.primaryImageUrl ? (
            <img
              src={product.primaryImageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image Available
            </div>
          )}

          {/* Out of Stock Indicator */}
          {!product.inStock && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              OUT OF STOCK
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="p-4 space-y-1.5">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {product.brand}
          </div>

          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-gray-700">
            {product.title}
          </h3>

          {/* Ratings & Review Count */}
          <div className="flex items-center gap-1.5 pt-1 text-xs text-gray-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-semibold text-gray-900">
                {product.averageRating?.toFixed(1) || '0.0'}
              </span>
            </div>
            <span>•</span>
            <span className="text-gray-400">({product.reviewCount || 0})</span>
          </div>
        </div>
      </div>

      {/* Pricing & Category Badge */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 mt-3">
        <div>
          <span className="text-xs text-gray-400 block">From</span>
          <span className="text-base font-bold text-gray-900">
            ${Number(product.basePrice).toFixed(2)}
          </span>
        </div>

        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {product.categoryName}
        </span>
      </div>
    </Link>
  );
}
