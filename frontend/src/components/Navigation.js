import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClass = (path) => {
    const baseClass = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition duration-300 ease-in-out";
    const activeClass = "border-primary text-gray-900";
    const inactiveClass = "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:scale-105 transform";
    
    return `${baseClass} ${location.pathname === path ? activeClass : inactiveClass}`;
  };

  const getCartLinkClass = (path) => {
    const baseClass = "text-gray-500 hover:text-gray-700 p-1 rounded-full transition duration-300 ease-in-out";
    const activeClass = "text-primary transform scale-105";
    return `${baseClass} ${location.pathname === path ? activeClass : ''}`;
  };

  const getUserProfileLinkClass = (path) => {
    const baseClass = "text-gray-700 transition duration-300 ease-in-out";
    const activeClass = "font-bold text-primary transform scale-105";
    return `${baseClass} ${location.pathname.startsWith(path) ? activeClass : ''}`;
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center"> {/* Left side: Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary">RE-loop</span>
              </Link>
            </div>

            <div className="flex items-center sm:hidden"> {/* Right side for mobile: Cart, User Profile/Login/Register, Mobile menu button */}
              <div className="flex items-center space-x-4">
                <Link to="/cart" className={`${getCartLinkClass('/cart')} relative`}>
                  <i className="fas fa-shopping-cart text-xl"></i>
                  {getTotalItems() > 0 && (
                    <span className="absolute top-2 right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[0.65rem] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-700 rounded-full">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                {user ? (
                  <div className="relative">
                    <div className="flex items-center space-x-3">
                      <Link to={`/user/${user.id}`} className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                          {user.name.charAt(0)}
                        </div>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-x-4">
                    <Link to="/login" className="text-gray-500 hover:text-gray-700 transform hover:scale-105 transition duration-300">
                      Login
                    </Link>
                    <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transform hover:scale-105 transition duration-300">
                      Register
                    </Link>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Desktop main nav links and right side icons (hidden on mobile) */}
            <div className="hidden sm:flex sm:items-center sm:ml-6 sm:space-x-8">
              <Link to="/" className={getLinkClass('/')}>
                Home
              </Link>
              <Link to="/products" className={getLinkClass('/products')}>
                Products
              </Link>
              <Link to="/categories" className={getLinkClass('/categories')}>
                Categories
              </Link>
              {user && (
                <Link to="/sell" className={`ml-6 ${getLinkClass('/sell')}`}>
                  Sell
                </Link>
              )}
              {user && user.role === 'admin' && (
                <Link to="/admin" className={getLinkClass('/admin')}>
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center space-x-4 ml-6">
                <Link to="/cart" className={`${getCartLinkClass('/cart')} relative`}>
                  <i className="fas fa-shopping-cart text-xl"></i>
                  {getTotalItems() > 0 && (
                    <span className="absolute top-2 right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[0.65rem] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-700 rounded-full">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                {user ? (
                  <div className="relative">
                    <div className="flex items-center space-x-3">
                      <Link to={`/user/${user.id}`} className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                          {user.name.charAt(0)}
                        </div>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-x-4">
                    <Link to="/login" className="text-gray-500 hover:text-gray-700 transform hover:scale-105 transition duration-300">
                      Login
                    </Link>
                    <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transform hover:scale-105 transition duration-300">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        {isMobileMenuOpen && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Home
              </Link>
              <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Products
              </Link>
              <Link to="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Categories
              </Link>
              {user && (
                <Link to="/sell" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Sell
                </Link>
              )}
              {user && user.role === 'admin' && (
                <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

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
    </>
  );
};

export default Navigation;