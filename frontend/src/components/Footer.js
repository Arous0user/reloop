import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSellClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/sell');
    } else {
      navigate('/login');
    }
  };

  const handleBecomeSellerClick = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  const handleAdvertiseClick = (e) => {
    e.preventDefault();
    alert('COMING SOON');
  };

  const handleYourAccountClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate(`/user/${user.id}`);
    } else {
      navigate('/login');
    }
  };

  const handleHelpClick = (e) => {
    e.preventDefault();
    navigate('/help');
  };

  const handleInstagramClick = (e) => {
    e.preventDefault();
    window.open('https://www.instagram.com/re_loop_o1?igsh=bWI5d2UwdzIwcHc5', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer">
      <div className="footer-back-to-top" onClick={scrollToTop}>
        Back to top
      </div>
      <div className="footer-container">
        <div className="footer-section footer-about">
          <h2><a href="/" className="footer-logo">RE-loop</a></h2>
          <p>RE-loop is a revolutionary marketplace for pre-owned electronics, offering a sustainable and affordable way to buy and sell gadgets.</p>
        </div>

        <div className="footer-section">
          <h3>Connect with Us</h3>
          <ul className="social-media">
            <li><a href="https://www.facebook.com/share/1ALbBKSf2z/" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); window.open('https://www.facebook.com/share/1ALbBKSf2z/', '_blank', 'noopener,noreferrer'); }}><i className="fab fa-facebook-f"></i></a></li>
            <li><a href="https://www.instagram.com/re_loop_o1?igsh=bWI5d2UwdzIwcHc5" onClick={handleInstagramClick}><i className="fab fa-instagram"></i></a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Make Money with Us</h3>
          <ul>
            <li><a href="javascript:void(0)" onClick={handleSellClick}>Sell on RE-loop</a></li>
            <li><a href="javascript:void(0)" onClick={handleBecomeSellerClick}>Become a Seller</a></li>
            <li><a href="javascript:void(0)" onClick={handleAdvertiseClick}>Advertise Your Products</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Let Us Help You</h3>
          <ul>
            <li><a href="javascript:void(0)" onClick={handleYourAccountClick}>Your Account</a></li>
            <li><a href="javascript:void(0)" onClick={handleHelpClick}>Help</a></li>
            <li><a href="/terms-and-conditions">Terms & Conditions</a></li>
          </ul>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; 2023, RE-loop, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;