import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import api from '../api'; // Use the centralized api instance
import { useAuth } from '../context/AuthContext';
import PurchaseHistory from '../components/PurchaseHistory';
import './UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showWalletInfo, setShowWalletInfo] = useState(false); // State for wallet info popup
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedState, setEditedState] = useState('');
  const [editedPinCode, setEditedPinCode] = useState('');
  const [editedCity, setEditedCity] = useState('');
  const [editedHouseNo, setEditedHouseNo] = useState('');
  const [editedLocality, setEditedLocality] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { logout, user: currentUser } = useAuth();
  const currentUserId = currentUser?.id;
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedPhone(user.phone || '');
    setEditedHouseNo(user.address?.houseNo || '');
    setEditedCity(user.address?.city || '');
    setEditedState(user.address?.state || '');
    setEditedPinCode(user.address?.pinCode || '');
    setEditedLocality(user.address?.locality || '');
  };

  const handleSave = async () => {
    if (editedPhone.length !== 10) {
      setPhoneError('Wrong number');
      return;
    }
    setPhoneError('');

    try {
      const updatedUser = {
        name: editedName,
        email: editedEmail,
        phone: editedPhone,
        address: {
          houseNo: editedHouseNo,
          locality: editedLocality,
          city: editedCity,
          state: editedState,
          pinCode: editedPinCode,
        },
      };

      await api.put('/api/auth/profile', updatedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUser({ ...user, ...updatedUser });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save user details:', error);
    }
  };

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

  const handleBecomeSeller = async () => {
    try {
      await api.put('/api/auth/become-seller', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUser({ ...user, isSeller: true });
    } catch (error) {
      console.error('Failed to become seller:', error);
    }
  };

  // Calculate wallet balance based on seller's orders
  const calculateWalletBalance = async (userId) => {
    try {
      // Get wallet balance from the new API endpoint
      const response = await api.get(`/api/wallet/${userId}`);
      setWalletBalance(response.data.balance);
    } catch (error) {
      console.error('Failed to calculate wallet balance:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/api/auth/${userId}`);
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);
  
  useEffect(() => {
    if (userId) {
      calculateWalletBalance(userId);
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bg-navy-blue min-h-screen py-8">
        <div className="user-profile-container text-gray-800 my-8 mx-auto">
          <div className="user-profile-header">
          <div className="user-profile-avatar">
            <span className="user-profile-avatar-letter">{user.name.charAt(0)}</span>
          </div>
          <div className="user-profile-info">
            <h1 className="user-profile-name">{user.name}</h1>
          </div>
          <div className="user-profile-actions">
            {currentUserId && currentUserId !== userId && user.isSeller && (
              <button
                onClick={() => navigate(`/seller/${userId}/products`)}
                className="btn btn-secondary"
              >
                Buy Products
              </button>
            )}
          </div>
          <div className="user-profile-header-right">
            {user.isSeller && (
              <div className="wallet-container">
                <div 
                  className="wallet-display bg-green-500 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setShowWalletInfo(true)}
                >
                  <div className="wallet-label">Wallet</div>
                  <div className="wallet-balance">₹{walletBalance.toFixed(2)}</div>
                </div>

                {showWalletInfo && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <div className="flex justify-between items-center mb-4">
                        <h3>Wallet Information</h3>
                        <button onClick={() => setShowWalletInfo(false)} className="text-gray-500 hover:text-gray-700">
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p>
                        Current Balance: <span>₹{walletBalance.toFixed(2)}</span>
                      </p>
                      <p className="note">
                        <span>Note:</span> Withdrawal is only possible when products are verified by the admin.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>

                <div className="bg-white p-6 rounded-lg shadow-md">

                  <div className="user-details-form">

                    <div className="form-header">

                      <h2>Details</h2>

                      {isEditing ? (

                        <div>

                          <button

                            onClick={handleSave}

                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"

                          >

                            Save

                          </button>

                                            <button

                                              onClick={() => setIsEditing(false)}

                                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"

                                            >

                                              Cancel

                                            </button>

                        </div>

                      ) : (

                        <button

                          onClick={handleEdit}

                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"

                        >

                          Edit

                        </button>

                      )}

                    </div>

                    {isEditing ? (

                      <div className="form-body">

                        <div className="form-group">

                          <label>Name:</label>

                          <input

                            type="text"

                            value={editedName}

                            onChange={(e) => setEditedName(e.target.value)}

                          />

                        </div>

                        <div className="form-group">

                          <label>Email:</label>

                          <input

                            type="email"

                            value={editedEmail}

                            disabled

                          />

                        </div>

                        <div className="form-group">

                          <label>Phone:</label>

                          <input

                            type="text"

                            pattern="[0-9]*"

                            inputMode="numeric"

                            maxLength="10"

                            value={editedPhone}

                            onChange={(e) => {

                              const re = /^[0-9\b]+$/;

                              if (e.target.value === '' || (re.test(e.target.value) && e.target.value.length <= 10)) {

                                setEditedPhone(e.target.value);

                              }

                            }}

                          />

                          {phoneError && <p className="error-message">{phoneError}</p>}

                        </div>

                        <h3 className="text-xl font-bold mt-4 col-span-2">Address</h3>

                        <div className="form-group">

                          <label>House No:</label>

                          <input

                            type="text"

                            value={editedHouseNo}

                            onChange={(e) => setEditedHouseNo(e.target.value)}

                          />

                        </div>

                        <div className="form-group">

                          <label>City:</label>

                          <input

                            type="text"

                            value={editedCity}

                            onChange={(e) => setEditedCity(e.target.value)}

                          />

                        </div>

                        <div className="form-group">

                          <label>State:</label>

                          <input

                            type="text"

                            value={editedState}

                            onChange={(e) => setEditedState(e.target.value)}

                          />

                        </div>

                        <div className="form-group">

                          <label>Pin Code:</label>

                          <input

                            type="text"

                            pattern="[0-9]*"

                            inputMode="numeric"

                            maxLength="6"

                            value={editedPinCode}

                            onChange={(e) => {

                              const re = /^[0-9\b]+$/;

                              if (e.target.value === '' || (re.test(e.target.value) && e.target.value.length <= 6)) {

                                setEditedPinCode(e.target.value);

                              }

                            }}

                          />

                        </div>

                        <div className="form-group">

                          <label>Locality/Landmark:</label>

                          <input

                            type="text"

                            value={editedLocality}

                            onChange={(e) => setEditedLocality(e.target.value)}

                          />

                        </div>

                      </div>

                    ) : (

                      <div className="form-body">

                        <p><span>Name:</span> {user.name}</p>

                        <p><span>Email:</span> {user.email}</p>

                        <p><span>Phone:</span> {user.phone || 'N/A'}</p>

                        <h3 className="text-xl font-bold mt-4 col-span-2">Address</h3>

                        <p><span>House No:</span> {user.address?.houseNo || 'N/A'}</p>

                        <p><span>Locality/Landmark:</span> {user.address?.locality || 'N/A'}</p>

                        <p><span>City:</span> {user.address?.city || 'N/A'}</p>

                        <p><span>State:</span> {user.address?.state || 'N/A'}</p>

                        <p><span>Pin Code:</span> {user.address?.pinCode || 'N/A'}</p>

                      </div>

                    )}

                  </div>

                </div>

        

                {currentUser && currentUser.id === userId && !user.isSeller && (

                  <div className="become-seller-container">

                    <button

                      onClick={handleBecomeSeller}

                      className="btn btn-primary"

                    >

                      Become a Seller

                    </button>

                  </div>

                )}

        {currentUser && currentUser.id === userId && (
          <div className="purchase-history-container">
            <PurchaseHistory userId={userId} />
          </div>
        )}

        {currentUser && currentUser.id === userId && (
          <div className="referral-code-container bg-white p-6 rounded-lg shadow-md mt-8 text-center">
            <h2 className="text-xl font-bold">Your Referral Code</h2>
            <p 
              className="text-lg font-mono cursor-pointer"
              onClick={() => copyToClipboard(user.referralCode)}
            >
              {isCopied ? 'Copied!' : user.referralCode}
            </p>
            <div className="terms-and-conditions mt-4 text-left">
              <h3 className="text-lg font-bold">Terms and Conditions</h3>
              <ul className="list-disc list-inside mt-2">
                <li>Referrer gets a 1% commission in their wallet on the successful purchase made by the referred user.</li>
                <li>Referred user gets a 7-day extended warranty on their purchased product.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button
                onClick={confirmLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelLogout}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
