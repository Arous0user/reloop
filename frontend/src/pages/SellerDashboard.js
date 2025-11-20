import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../api'; // Use the centralized api instance
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';

const SellerDashboard = () => {
  const { sellerId } = useParams();
  const { user, refreshUser } = useAuth();
  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const fetchSellerData = useCallback(async () => {
    try {
      const response = await api.get(`/api/auth/${sellerId}`);
      setSeller(response.data.user);
    } catch (error) {
      console.error('Failed to fetch seller data:', error);
    }
  }, [sellerId]);

  const fetchSellerProducts = useCallback(async () => {
    try {
      const response = await api.get(`/api/products?sellerId=${sellerId}`);
      setSellerProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch seller products:', error);
    }
  }, [sellerId]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await api.get(`/api/reviews/user/${sellerId}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  }, [sellerId]);

  useEffect(() => {
    if (sellerId) {
      fetchSellerData();
      fetchSellerProducts();
      fetchReviews();
    }
  }, [sellerId, fetchSellerData, fetchSellerProducts, fetchReviews]);

  useEffect(() => {
    if (reviews.length > 0 && user) {
      const userHasReviewed = reviews.some(review => review.reviewerId === user.id);
      setHasReviewed(userHasReviewed);
    }
  }, [reviews, user]);

  const handleDelete = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/products/${productToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Refresh the seller's products
      fetchSellerProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {seller && (
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">{seller.name}'s Products</h2>
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900 mr-4">
                Seller Rating: {seller.sellerRating ? seller.sellerRating.toFixed(1) : 'N/A'}
              </div>
              {user && user.id !== sellerId && !hasReviewed && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="btn btn-primary"
                >
                  Rate and Review
                </button>
              )}
            </div>
          </div>
        )}
        
        {sellerProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {sellerProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                {user && user.id === sellerId && (
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">This seller has not listed any products yet.</p>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Reviews for {seller && seller.name}</h2>
          {reviews.length > 0 ? (
            <ul className="mt-6 space-y-6">
              {reviews.map((review) => (
                <li key={review.id} className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <p className="font-bold mr-2">{review.reviewer.name}</p>
                    <p className="text-gray-600">Rating: {review.rating}/5</p>
                  </div>
                  <p>{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this product?</p>
            <div className="modal-actions">
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <ReviewModal
          targetUserId={sellerId}
          reviewerUserId={user.id}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={(newReview) => {
            console.log('Review submitted:', newReview);
            fetchReviews();
            fetchSellerData();
            refreshUser();
          }}
        />
      )}
    </div>
  );
};

export default SellerDashboard;
