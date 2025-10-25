import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { categories } from '../utils/categories';
import { Link } from 'react-router-dom'; // Import Link

const Home = () => {
  const { products, searchProducts, loading } = useProducts(); // Get loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchProducts(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Get featured products (first 4 for demo)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8">Discover Amazing Products</h1>
          <p className="text-xl md:text-2xl mb-10">From trusted sellers around the world</p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..." 
                className="flex-grow px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-r-lg transition duration-300 transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Products...</h3>
          <p className="text-gray-600">Please wait while we fetch the products.</p>
        </div>
      )}

      {/* Search Results */}
      {!loading && searchResults.length > 0 && (
        <section className="py-12 bg-powder-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-base-text mb-6">
              Search Results for "{searchQuery}"
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories */}
      {!loading && (
        <section className="py-16 bg-powder-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-base-text">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category, index) => (
                <Link to={`/products?category=${category.name}`} key={index} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-base-text">{category.name}</h3>
                    <p className="text-gray-600 mb-4">Find the best {category.name.toLowerCase()} products</p>
                    {/* Removed the button as the entire box is clickable */}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {!loading && (
        <section className="py-16 bg-powder-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-base-text">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;