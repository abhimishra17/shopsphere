import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Loader2, X } from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';

/**
 * ProductsPage Component (FE-US-04)
 * 
 * Full multi-facet catalog discovery page:
 * - Live keyword search with auto-debounce
 * - Department/category filter sidebar from /api/v1/categories/flat
 * - Min and Max price range filtering
 * - Dynamic sorting (Newest, Price: Low to High, Price: High to Low, Rating)
 * - Empty state with "Clear Filters" button
 */
export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from URL query params
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  // 1. Fetch flat category list for filter sidebar
  useEffect(() => {
    api.get('/categories/flat')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // 2. Fetch products whenever filter values change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          keyword: keyword || undefined,
          category: selectedCategory || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sortBy,
          direction,
          page: 0,
          size: 24,
        };

        const res = await api.get('/products', { params });
        setProducts(res.data.content || []);
        setTotalElements(res.data.totalElements || 0);

        // Sync query params in browser URL
        const newParams = {};
        if (keyword) newParams.keyword = keyword;
        if (selectedCategory) newParams.category = selectedCategory;
        if (minPrice) newParams.minPrice = minPrice;
        if (maxPrice) newParams.maxPrice = maxPrice;
        setSearchParams(newParams);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, 300); // 300ms debounce
    return () => clearTimeout(timeout);
  }, [keyword, selectedCategory, minPrice, maxPrice, sortBy, direction]);

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt');
    setDirection('desc');
    setSearchParams({});
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val === 'price_asc') {
      setSortBy('basePrice');
      setDirection('asc');
    } else if (val === 'price_desc') {
      setSortBy('basePrice');
      setDirection('desc');
    } else if (val === 'rating') {
      setSortBy('averageRating');
      setDirection('desc');
    } else {
      setSortBy('createdAt');
      setDirection('desc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Search Bar & Sort Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, brand..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:bg-white transition"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 whitespace-nowrap">Sort by:</span>
          <select
            onChange={handleSortChange}
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar */}
        <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </div>
            {(keyword || selectedCategory || minPrice || maxPrice) && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Department / Category Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Department
            </h4>
            <div className="space-y-1.5 max-h-56 overflow-y-auto text-sm">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === ''
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Departments
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCategory === cat.slug
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Price Range ($)
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Right Products Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-xs text-gray-500">
            Showing <strong className="text-gray-900">{totalElements}</strong> products
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading products...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center space-y-3 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base">No products match your search.</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try adjusting your search terms, changing the department, or resetting the price filter.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
