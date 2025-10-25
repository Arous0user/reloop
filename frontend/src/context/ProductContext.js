import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const ProductContext = createContext();

// Custom hook to use the product context
export const useProducts = () => {
  return useContext(ProductContext);
};

// Product provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  const fetchProducts = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await axios.get('http://localhost:5001/api/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching (or error)
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get product by ID
  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  // Search products
  const searchProducts = (query) => {
    if (!query) return products;
    
    const localResults = products.filter(product => 
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
    );

    // For now, we'll just return local results.
    // AI recommendations will be integrated here later.
    return localResults;
  };

  // Get recommended products using AI
  const getRecommendedProducts = async (query) => {
    try {
      const response = await axios.post('http://localhost:5001/api/ai/recommendations', { query });
      return response.data.recommendations;
    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
      return [];
    }
  };

  // Context value
  const value = {
    products,
    loading, // Export loading state
    getProductById,
    getProductsByCategory,
    searchProducts,
    getRecommendedProducts,
    refreshProducts: fetchProducts, // Export the refresh function
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};