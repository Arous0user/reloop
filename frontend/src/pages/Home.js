import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import BACKEND_URL from '../config';


const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products`);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div 
        className="max-w-7xl mx-auto px-4 py-8" 
        style={{
          backgroundImage: `url(https://img.freepik.com/free-photo/colorful-festival-colors-spread-dark-surface_23-2148054187.jpg?semt=ais_hybrid&w=740&q=80)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Discover Amazing Products</h1>
          <p className="text-gray-200">From trusted sellers around the world</p>
        </div>
        <div className="mb-8">
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            <button className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No products found</h2>
            <p className="text-gray-600">Try adjusting your search.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;