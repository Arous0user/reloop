import React from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../config';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-[28rem]">
      <Link to={`/products/${product.id}`} className="block flex flex-col h-full"> 
        <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={`${BACKEND_URL}${product.images[0].url}`}
              alt={product.title} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-4xl text-gray-400">
              <i className="fas fa-camera"></i>
            </div>
          )}
        </div>
        <div className="px-4 py-2 mt-auto"> 
          <h3 className="text-xl font-bold mb-2 text-base-text leading-tight line-clamp-2">{product.title}</h3>

          <div className="flex items-baseline mb-3">
            {product.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-base-text">{formatCurrency(discountedPrice)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">{formatCurrency(product.price)}</span>
                <span className="ml-2 text-sm font-bold text-green-600">{product.discount}% off</span>
              </>
            ) : (
              <span className="text-lg font-bold text-base-text">{formatCurrency(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;