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
import Categories from './pages/Categories';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import SellProduct from './pages/SellProduct';
import Notification from './components/Notification'; // Import Notification

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/sell" element={<SellProduct />} />
                </Routes>
              </main>
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