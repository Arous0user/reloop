import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import api from '../api'; // Use the centralized api instance
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, getTotalPrice, applyWarranty } = useCart();
  const { user, authToken } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showRetryDialog, setShowRetryDialog] = useState(false);
  const navigate = useNavigate();

  const handleApplyReferral = async () => {
    if (user && user.referralCode === referralCode) {
      alert('You cannot use your own referral code.');
      return;
    }

    try {
      const response = await api.post('/api/auth/validate-referral', { referralCode });
      if (response.data.success) {
        // Apply 7-day warranty to all items in the cart
        cartItems.forEach(item => {
          applyWarranty(item.product.id, { cost: 0, duration: '7 Days' });
        });
        alert('Referral code applied successfully! You have received a 7-day extended warranty.');
      } else {
        alert('Invalid referral code.');
      }
    } catch (error) {
      console.error('Failed to validate referral code:', error);
      alert('Invalid referral code.');
    }
  };

  const subtotal = getTotalPrice();
  const processingFee = subtotal * 0.03;
  const totalPrice = subtotal + processingFee;

  const handlePayment = async () => {
    try {
      const orderResponse = await api.post(
        '/api/payments/razorpay/orders',
        {
          amount: Math.round(totalPrice * 100),
          currency: 'INR',
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const { id, amount, currency } = orderResponse.data;

      console.log('Razorpay Order ID:', id);
      console.log('Razorpay Amount:', amount);
      console.log('Razorpay Currency:', currency);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: amount,
        currency: currency,
        name: 'RE-loop',
        description: 'Purchase from RE-loop',
        order_id: id,
        handler: async function (response) {
          console.log('Razorpay handler executed. Response:', response);
          try {
            // Then, create the order
            console.log('Attempting to create order...');
            await api.post(
              '/api/orders',
              {
                items: JSON.stringify(cartItems.map(item => ({
                  productId: item.product.id,
                  quantity: item.quantity,
                  priceCents: item.product.price * 100,
                  warranty: item.warranty,
                }))),
                totalCents: Math.round(totalPrice * 100),
                currency: 'INR', // Assuming INR as the currency
                referralCode: referralCode,
              },
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            console.log('Order created successfully. Showing success dialog.');
            setShowSuccessDialog(true); // Show success dialog
          } catch (error) {
            console.error('Failed to update stock or create order:', error);
            alert('Order processing failed. Please contact support.'); // Add an alert for user feedback
          }
        },
        prefill: {
          name: user ? user.name : '',
          email: user ? user.email : '',
          contact: user ? user.phone : '', // Assuming user has a phone number
        },
        notes: {
          address: 'RE-loop Office',
        },
        theme: {
          color: '#3399cc',
        },
      };
      console.log('Razorpay Options:', options);
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment error:', error);
      setShowRetryDialog(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id}>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{item.product.title} (x{item.quantity})</span>
                    <span className="text-gray-900">{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                  {item.warranty && item.warranty.cost > 0 && (
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Warranty: {item.warranty.duration}</span>
                      <span>{formatCurrency(item.warranty.cost * item.quantity)}</span>
                    </div>
                  )}
                  {item.warranty && item.warranty.duration === '7 Days' && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>7-Day Extended Warranty</span>
                      <span>Free</span>
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <div>
                  <span className="text-gray-500 line-through mr-2">{formatCurrency(500)}</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-gray-600">Processing Fee</span>
                <div>
                  <span className="text-gray-500 line-through mr-2">5%</span>
                  <span className="text-green-600 font-bold">3%</span>
                  <span className="text-gray-900 ml-2">{formatCurrency(processingFee)}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Referral Code</h2>
            <div className="flex">
              <input 
                type="text" 
                value={referralCode} 
                onChange={(e) => setReferralCode(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter referral code"
              />
              <button 
                onClick={handleApplyReferral} 
                className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark"
              >
                Apply
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
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
            <button
              onClick={handlePayment}
              className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>

      {showSuccessDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Purchase Successful!</h2>
            <p className="text-gray-700 mb-6">Your order has been placed and your payment was successful.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {showRetryDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed!</h2>
            <p className="text-gray-700 mb-6">There was an issue processing your payment. Would you like to try again?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowRetryDialog(false);
                  handlePayment(); // Retry the payment
                }}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Retry Payment
              </button>
              <button
                onClick={() => setShowRetryDialog(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
