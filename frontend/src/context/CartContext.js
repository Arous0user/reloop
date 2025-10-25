import React, { createContext, useState, useContext } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null); // New state for notification

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    console.log('Adding to cart:', product, quantity);
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newItems = prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        console.log('Cart updated:', newItems);
        setNotification({ message: `${product.title} quantity updated in cart!`, type: 'success' });
        return newItems;
      } else {
        const newItems = [...prevItems, { product, quantity }];
        console.log('Cart updated:', newItems);
        setNotification({ message: `${product.title} added to cart!`, type: 'success' });
        return newItems;
      }
    });

    // Clear notification after a few seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items in cart
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  };

  // Calculate total price with discount
  const getTotalPriceWithDiscount = () => {
    return cartItems.reduce(
      (total, item) => {
        const discount = item.product.discount || 0;
        const discountedPrice = item.product.price * (1 - discount / 100);
        return total + (discountedPrice * item.quantity);
      },
      0
    );
  };

  // Context value
  const value = {
    cartItems,
    notification, // Export notification state
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalPriceWithDiscount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};