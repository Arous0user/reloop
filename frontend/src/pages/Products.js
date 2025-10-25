import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { formatCurrency } from '../utils/currency';
import { categories } from '../utils/categories';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Products = () => {
  const { products, loading } = useProducts(); // Get loading state
  const query = useQuery();
  const navigate = useNavigate(); // Initialize useNavigate
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false); // New state for filter visibility

  useEffect(() => {
    const category = query.get('category');
    if (category) {
      setFilter(category);
    } else {
      setFilter('all'); // Reset filter if no category in URL
    }
  }, [query]);

  const handleCategoryChange = (newCategory) => {
    setFilter(newCategory);
    // Update URL query parameter
    const params = new URLSearchParams(query);
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    navigate({ search: params.toString() });
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    // Category filter
    if (filter !== 'all' && product.category !== filter) {
      return false;
    }
    
    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.seller?.rating || 0) - (a.seller?.rating || 0);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
      
      <div className="flex flex-col md:flex-row">
        {/* Filter Toggle Button for small screens */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary-dark flex items-center justify-center transform hover:scale-105 transition duration-300"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'} ml-2`}></i>
          </button>
        </div>

        {/* Filters Sidebar */}
        <div className={`w-full md:w-64 mb-6 md:mb-0 md:mr-8 transition-all duration-300 ease-in-out ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filter === 'all'}
                    onChange={() => handleCategoryChange('all')}
                    className="h-4 w-4 text-primary"
                  />
                  <span className="ml-2 text-gray-700">All Categories</span>
                </label>
                {categories.map(category => (
                  <label key={category.name} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={filter === category.name}
                      onChange={() => handleCategoryChange(category.name)}
                      className="h-4 w-4 text-primary"
                    />
                    <span className="ml-2 text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Price Range</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{formatCurrency(priceRange[0])}</span>
                  <span className="text-gray-600">{formatCurrency(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1">
          {/* Sorting and Results Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-gray-600 mb-2 sm:mb-0">
              Showing {sortedProducts.length} of {products.length} products
            </p>
            
            <div className="flex items-center">
              <span className="text-gray-700 mr-2">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 transform hover:scale-105 transition duration-300"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
          
          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Products...</h3>
              <p className="text-gray-600">Please wait while we fetch the products.</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more products.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;