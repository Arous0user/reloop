import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navigation = () => {
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const dropdownMenu = () => (
    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        {(user.role === 'seller' || user.role === 'admin') && (
          <Link to={user.role === 'admin' ? '/admin' : `/seller/${user.id}`} onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Dashboard</Link>
        )}
        <Link to={`/user/${user.id}`} onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My Profile</Link>
      </div>
    </div>
  );

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center"> {/* Left side: Logo and main nav links */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary">RE-loop</span>
              </Link>
              <div className="hidden sm:flex sm:items-center sm:ml-6 sm:space-x-8">
                <Link to="/" className={getLinkClass('/')}>
                  Home
                </Link>
                <Link to="/products" className={getLinkClass('/products')}>
                  Products
                </Link>
                {user && user.isSeller && (
                  <Link to="/sell" className={getLinkClass('/sell')}>
                    Sell
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center"> {/* Right side for all screen sizes: Cart, User Profile/Login/Register, Mobile menu button */}
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
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500" onClick={toggleDropdown}>
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    {isDropdownOpen && dropdownMenu()}
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
              <div className="-mr-2 flex items-center sm:hidden">
                <button
                  onClick={toggleMobileMenu}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        <div ref={mobileMenuRef} className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Home
            </Link>
            <Link to="/products" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Products
            </Link>
            {user && user.isSeller && (
              <Link to="/sell" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Sell</Link>
            )}
          </div>
        </div>
      </nav>


    </>
  );
};

export default Navigation;