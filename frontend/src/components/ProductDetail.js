import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import BACKEND_URL from '../config';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = getProductById(id);

  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  // Calculate discounted price
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 h-96 flex items-center justify-center"> {/* Added h-96 and flex properties */}
            {product.images && product.images.length > 0 ? (
              <img 
                src={`${BACKEND_URL}${product.images[selectedImage].url}`} // Prepend backend URL
                alt={product.title} 
                className="max-h-full max-w-full object-contain" // Adjusted image classes
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400"> {/* Adjusted placeholder classes */}
                <i className="fas fa-camera"></i>
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 h-24 bg-white rounded-lg shadow-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-primary' : ''} transform hover:scale-105 transition duration-300`}
                >
                  <img 
                    src={`${BACKEND_URL}${image.url}`} // Prepend backend URL
                    alt={`Product ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-base-text mb-4">{product.title}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < Math.floor(product.seller?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  <i className="fas fa-star"></i>
                </span>
              ))}
              <span className="ml-2 text-gray-600">{product.seller?.rating || 'N/A'}</span>
            </div>
            <span className="mx-4 text-gray-300">•</span>
            <span className="text-gray-600">By </span>
            {product.seller ? (
              <Link to={{ pathname: `/user/${product.seller.id}` }} onClick={() => sessionStorage.setItem('fromSellerLink', 'true')} className="text-primary hover:underline ml-1">
                {product.seller.name}
              </Link>
            ) : (
              <span className="ml-1">Unknown Seller</span>
            )}
          </div>
          
          <div className="mb-6">
            {product.discount > 0 ? (
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-base-text">{formatCurrency(discountedPrice)}</span>
                <span className="ml-4 text-2xl text-gray-500 line-through">{formatCurrency(product.price)}</span>
                <span className="ml-4 text-lg font-bold text-green-600">{product.discount}% off</span>
              </div>
            ) : (
              <span className="text-4xl font-bold text-base-text">{formatCurrency(product.price)}</span>
            )}
          </div>
          

          
          <div className="mb-6">
            <h3 className="text-xl font-medium text-base-text mb-2">Product Details</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Category: {product.category}</li>
              <li>In Stock: {product.stock} items</li>
              <li>Tags: {product.tags.join(', ')}</li>
            </ul>
          </div>
          
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="flex items-center">
              <span className="mr-4 text-lg text-gray-700">Quantity:</span>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md transform hover:scale-105 transition duration-300"
                >
                  -
                </button>
                <span className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300 text-lg">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md transform hover:scale-105 transition duration-300"
                >
                  +
                </button>
              </div>
              <span className="ml-4 text-gray-600">{product.stock} items available</span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white py-3 rounded-md font-medium text-lg hover:bg-primary-dark transform hover:scale-105 transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Description */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-base-text mb-4">Product Description</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;