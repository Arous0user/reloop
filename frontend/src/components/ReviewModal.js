import React, { useState } from 'react';
import api from '../api'; // Use the centralized api instance
import { useAuth } from '../context/AuthContext'; // Import useAuth

const ReviewModal = ({ targetUserId, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { authToken, refreshUser } = useAuth(); // Get authToken and refreshUser from useAuth

  const handleSubmitReview = async () => {
    if (!rating) {
      setError('Please provide a rating.');
      return;
    }
    if (!reviewText.trim()) {
      setError('Please write a review.');
      return;
    }

    setError('');
    setSuccess('');

    if (!authToken) {
      setError('You must be logged in to submit a review.');
      return;
    }

    console.log('Auth Token:', authToken); // Debugging line

    try {
      const response = await api.post(`/api/reviews/user/${targetUserId}`, {
        rating,
        comment: reviewText,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSuccess('Review submitted successfully!');
      onReviewSubmitted(response.data.review);
      await refreshUser(); // Refresh user data
      setTimeout(onClose, 2000); // Close modal after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Submit a Review</h3>
          <div className="mt-2 px-7 py-3">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Rating:</label>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">Your Review:</label>
              <textarea
                id="reviewText"
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>

            <div className="items-center px-4 py-3 sm:flex sm:justify-center sm:space-x-4">
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto transform hover:scale-105 transition duration-300"
              >
                Submit Review
              </button>
              <button
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm transform hover:scale-105 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
