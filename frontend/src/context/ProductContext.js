import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';

// Create the context
const ProductContext = createContext();

// Custom hook to use the product context
export const useProducts = () => {
  return useContext(ProductContext);
};

// Product provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    pages: 1
  });

  // Fetch products with pagination
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/products`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 24,
          category: params.category,
          q: params.search,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          sellerId: params.sellerId // Add sellerId parameter
        }
      });
      
      // For the context, we'll still keep all products in memory for filtering
      // In a real large-scale app, we would only keep the current page in memory
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

    return localResults;
  };

  // Get recommended products using AI
  const getRecommendedProducts = async (query) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/ai/recommendations`, { query });
      return response.data.recommendations;
    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
      return [];
    }
  };

  // Refresh products
  const refreshProducts = () => {
    fetchProducts();
  };

  // Context value
  const value = {
    products,
    loading,
    pagination,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getRecommendedProducts,
    refreshProducts,
    fetchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};