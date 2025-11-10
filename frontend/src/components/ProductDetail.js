import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import BACKEND_URL from '../config';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [warranty, setWarranty] = useState({ cost: 0, duration: '3 Days' });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products/${slug}`);
        setProduct(response.data.product);
        setTotalPrice(response.data.product.price);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleWarrantyChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const warrantyPercentage = parseFloat(e.target.value);
    const duration = selectedOption.text.split('–')[0].trim();
    const cost = (product.price * warrantyPercentage) / 100;
    setWarranty({ cost, duration });
    setTotalPrice(product.price + cost);
  };

  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity, warranty);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 h-96 flex items-center justify-center"> {/* Added h-96 and flex properties */}
            {product.images && product.images.length > 0 ? (
              <img 
                src={`${BACKEND_URL}${product.images[selectedImage].url}`} // Prepend backend URL
                alt={product.title} 
                className="max-h-full max-w-full object-contain" // Adjusted image classes
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400"> {/* Adjusted placeholder classes */}
                <i className="fas fa-camera"></i>
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 h-24 bg-white rounded-lg shadow-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-primary' : ''} transform hover:scale-105 transition duration-300`}
                >
                  <img 
                    src={`${BACKEND_URL}${image.url}`} // Prepend backend URL
                    alt={`Product ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-base-text mb-4">{product.title}</h1>
          <div className="flex items-center mb-4">

            <span className="text-gray-600">By </span>
            {product.seller ? (
              <Link to={`/seller/${product.seller.id}`} className="text-primary hover:underline ml-1">
                {product.seller.name}
              </Link>
            ) : (
              <span className="ml-1">Unknown Seller</span>
            )}
          </div>
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-base-text">{formatCurrency(totalPrice)}</span>
          </div>
          
          <div className="warranty-section">
            <label htmlFor="warranty-options">Extended Warranty:</label>
            <select id="warranty-options" onChange={handleWarrantyChange}>
              <option value="0">3 Days Warranty – Free</option>
              <option value="0.7">1 Month Warranty – 0.7% of product price</option>
              <option value="1.1">1 Month Warranty – 1.1% of product price</option>
              <option value="2.3">3 Months Warranty – 2.3% of product price</option>
              <option value="5">6 Months Warranty – 5% of product price</option>
            </select>
          </div>
          
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="flex items-center">
              <span className="mr-4 text-lg text-gray-700">Quantity:</span>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300 text-lg">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <span className="ml-4 text-gray-600">{product.stock} items available</span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            {product.stock > 0 && !product.soldOut ? (
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white py-3 rounded-md font-medium text-lg hover:bg-primary-dark transform hover:scale-105 transition duration-300"
              >
                Add to Cart
              </button>
            ) : (
              <p className="text-red-500 font-bold">Out of Stock</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Description */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-base-text mb-4">Product Description</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;