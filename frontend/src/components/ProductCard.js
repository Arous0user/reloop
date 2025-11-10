import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../config';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[28rem]">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden relative">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-300 rounded-full h-12 w-12"></div>
            </div>
          )}
          
          {imageError ? (
            <div className="text-4xl text-gray-400">
              <i className="fas fa-camera"></i>
            </div>
          ) : product.images && product.images.length > 0 ? (
            <img 
              src={`${BACKEND_URL}${product.images[0].url}`}
              alt={product.title} 
              className={`w-full h-full object-cover transform hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'block' : 'hidden'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="text-4xl text-gray-400">
              <i className="fas fa-camera"></i>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="text-xl font-bold mb-2 text-base-text leading-tight line-clamp-2">{product.title}</h3>
        </Link>

        <div className="flex items-baseline mb-3">
          <span className="text-lg font-bold text-base-text">{formatCurrency(product.price)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>Sold by: </span>
          {product.seller ? (
            <Link to={`/seller/${product.seller.id}`} className="text-primary hover:underline ml-1">
              {product.seller.name}
            </Link>
          ) : (
            <span className="ml-1">Unknown</span>
          )}
        </div>

        <div className="mt-auto">
          {product.stock > 0 ? (
            <button 
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary-dark transform hover:scale-105 transition duration-300"
            >
              Add to Cart
            </button>
          ) : (
            <p className="text-red-500 font-bold text-center">Out of Stock</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;