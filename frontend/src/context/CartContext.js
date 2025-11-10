import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Could not parse cart data from localStorage:', error);
      return [];
    }
  });
  const [notification, setNotification] = useState(null); // New state for notification

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1, warranty = { cost: 0, duration: '3 Days' }) => {
    console.log('Adding to cart:', product, quantity, warranty);
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          setNotification({ message: `Only ${product.stock} items of ${product.title} are available.`, type: 'error' });
          return prevItems;
        }
        const newItems = prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        console.log('Cart updated:', newItems);
        setNotification({ message: `${product.title} quantity updated in cart!`, type: 'success' });
        return newItems;
      } else {
        if (quantity > product.stock) {
          setNotification({ message: `Only ${product.stock} items of ${product.title} are available.`, type: 'error' });
          return prevItems;
        }
        const newItems = [...prevItems, { product, quantity, warranty }];
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
      prevItems.map(item => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            setNotification({ message: `Only ${item.product.stock} items of ${item.product.title} are available.`, type: 'error' });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Apply warranty to an item
  const applyWarranty = (productId, warranty) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, warranty }
          : item
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
      (total, item) => total + (item.product.price + (item.warranty ? item.warranty.cost : 0)) * item.quantity,
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
    applyWarranty,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};