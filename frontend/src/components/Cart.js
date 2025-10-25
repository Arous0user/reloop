import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPriceWithDiscount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // In a real app, you would navigate to the checkout page
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary-dark transform hover:scale-105 transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cartItems.map(({ product, quantity }) => (
                <li key={product.id} className="p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].url} 
                          alt={product.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <i className="fas fa-camera"></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
                          <p className="text-gray-600">{product.seller?.name || 'Unknown Seller'}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-400 hover:text-gray-500 transform hover:scale-105 transition duration-300"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md transform hover:scale-105 transition duration-300"
                          >
                            -
                          </button>
                          <span className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300">
                            {quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md transform hover:scale-105 transition duration-300"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right">
                          {product.discount > 0 ? (
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                {formatCurrency(product.price * (1 - product.discount / 100) * quantity)}
                              </p>
                              <p className="text-sm text-gray-500 line-through">
                                {formatCurrency(product.price * quantity)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(product.price * quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(getTotalPriceWithDiscount())}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">Free</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatCurrency(0)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(getTotalPriceWithDiscount())}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary-dark mt-6 transform hover:scale-105 transition duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;