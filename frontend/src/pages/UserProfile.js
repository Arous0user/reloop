import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Removed useLocation
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import BACKEND_URL from '../config';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // Removed isFromSellerLink state

  // Removed useEffect related to sessionStorage

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/${userId}`);
        const { user } = response.data;
        setUser(user);
        setProducts(user.products || []);
        setReviews(user.reviewsReceived || []);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Handle error, e.g., redirect to 404 or show error message
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  };

  console.log('Logged-in user:', user);
  console.log('Profile userId from params:', userId);
  console.log(`Is current user's profile:`, user && user.id === userId);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-500">{user.name.charAt(0)}</span>
            </div>
          </div>
          <div className="ml-8">
            <div className="flex items-center justify-between"> {/* Added flex and justify-between */}
              <h1 className="text-3xl font-bold text-base-text">{user.name}</h1>

            </div>

            <div className="flex items-center mt-4">
              <div className="mr-8">
                <span className="font-bold">Seller Rating:</span> {user.sellerRating || 'N/A'}
              </div>
              <div>
                <span className="font-bold">Buyer Rating:</span> {user.buyerRating || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-base-text mb-4">Products for Sale</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-base-text mb-4">Reviews</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          {reviews.length > 0 ? (
            <ul className="space-y-8">
              {reviews.map((review) => (
                <li key={review.id}>
                  {/* Review item */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>

    {/* Logout Confirmation Dialog */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Logout</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500">Are you sure you want to log out?</p>
            </div>
            <div className="items-center px-4 py-3 sm:flex sm:justify-center sm:space-x-4">
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 sm:w-auto transform hover:scale-105 transition duration-300"
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelLogout}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm transform hover:scale-105 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </> // Added closing React Fragment
  );
};

export default UserProfile;