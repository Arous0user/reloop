import React, { useState, useEffect } from 'react';
import api from '../api'; // Use the centralized api instance
import ProductCard from '../components/ProductCard';
import FilterDropdown from '../components/FilterDropdown';
import { categories } from '../utils/categories';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: { min: 0, max: 100000 },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOrder(e.target.value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProducts = products
    .filter(product => {
      const searchTermLower = searchTerm.toLowerCase();
      const titleMatch = product.title.toLowerCase().includes(searchTermLower);
      const tagMatch = product.tags.some(tag => tag.toLowerCase().includes(searchTermLower));
      return titleMatch || tagMatch;
    })
    .filter(product => {
      if (filters.category === 'all') {
        return true;
      }
      return product.category === filters.category;
    })
    .filter(product => {
      return product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
    })
    .sort((a, b) => {
      if (sortOrder === 'price-asc') {
        return a.price - b.price;
      } else if (sortOrder === 'price-desc') {
        return b.price - a.price;
      } else {
        return 0;
      }
    });

  return (
    <div className="bg-silver min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products by title or tag..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            style={{borderRadius: '50px'}}
          />
        </div>
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setShowFilter(true)} className="p-2 border border-gray-300 rounded-md" style={{backgroundColor: 'white'}}>
            Filter
          </button>
          <select onChange={handleSort} className="p-2 border border-gray-300 rounded-md">
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <FilterDropdown 
          categories={categories}
          onFilterChange={handleFilterChange}
          isOpen={showFilter}
          setIsOpen={setShowFilter}
        />

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No products found</h2>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
