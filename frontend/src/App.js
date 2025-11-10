import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext'; // Import useCart
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import SellProduct from './pages/SellProduct';
import SellerDashboard from './pages/SellerDashboard';
import Help from './pages/Help';
import About from './pages/About';
import TermsAndConditions from './pages/TermsAndConditions'; // Import TermsAndConditions
import Footer from './components/Footer';
import Notification from './components/Notification'; // Import Notification

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navigation />
              <main style={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/sell" element={<SellProduct />} />
                  <Route path="/seller/:sellerId" element={<SellerDashboard />} />
                  <Route path="/seller/:sellerId/products" element={<Products />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                </Routes>
              </main>
              <Footer />
              <CartNotification /> {/* Render CartNotification component */}
            </div>
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

// Create a wrapper component to access useCart hook
function CartNotification() {
  const { notification } = useCart();
  return <Notification message={notification?.message} type={notification?.type} />;
}

export default App;