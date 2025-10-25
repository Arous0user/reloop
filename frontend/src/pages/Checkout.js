import React from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';

const Checkout = () => {
  const { cartItems, getTotalPrice } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">{item.title} (x{item.quantity})</span>
                  <span className="text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(getTotalPrice())}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
            {/* Payment form will go here */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Our Guarantees</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-green-500 text-2xl mr-3"></i>
                  <span className="text-gray-600">Secure Payments</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-undo text-green-500 text-2xl mr-3"></i>
                  <span className="text-gray-600">Money-back Guarantee</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-truck text-green-500 text-2xl mr-3"></i>
                  <span className="text-gray-600">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;