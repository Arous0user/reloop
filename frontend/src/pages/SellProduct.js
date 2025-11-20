import React, { useState, useEffect } from 'react';
import { categories } from '../utils/categories';
import { useProducts } from '../context/ProductContext';
import api from '../api'; // Use the centralized api instance
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SellProduct = () => {
  const { refreshProducts } = useProducts();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [stock, setStock] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      alert('You can only upload a maximum of 10 images.');
      return;
    }
    if (files.length > 0) {
      setImages(files);
      const newImagePreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImagePreviews.push(reader.result);
          if (newImagePreviews.length === files.length) {
            setImagePreviews(newImagePreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('priceCents', parseFloat(price) * 100);
    formData.append('category', category);
    formData.append('stock', stock); // Add stock to formData
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const token = localStorage.getItem('token'); 
      await api.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      alert('Product added successfully!');
      refreshProducts();
      navigate('/products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sell a Product</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Product Title
            </label>
            <div className="mt-1">
              <input
                id="title"
                name="title"
                type="text"
                required
                autoComplete="off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Product Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows="3"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              ></textarea>
            </div>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <div className="mt-1">
              <input
                id="price"
                name="price"
                type="number"
                required
                autoComplete="off"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock (Quantity)
            </label>
            <div className="mt-1">
              <input
                id="stock"
                name="stock"
                type="number"
                required
                autoComplete="off"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <div className="mt-1 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
              <p><strong>Note:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>Maximum 10 images per product.</li>
                <li>Maximum size: 5MB per image.</li>
                <li>Supported formats: JPG, PNG, GIF.</li>
              </ul>
            </div>
            <div className="mt-1 flex items-center">
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Product preview ${index + 1}`} className="h-16 w-16 object-cover rounded-md" />
                ))}
                {imagePreviews.length === 0 && (
                  <span className="inline-block h-16 w-16 overflow-hidden bg-gray-100 rounded-md">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.993A2 2 0 002 19h20a2 2 0 002-2.007zM12 13c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z" />
                    </svg>
                  </span>
                )}
              </div>
              <label
                htmlFor="image-upload"
                className="ml-5 bg-cyan-500 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm leading-4 font-medium text-white hover:bg-lime-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer transition duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <i className="fas fa-cloud-upload-alt"></i> {/* Added icon */}
                <span>Upload image</span>
                <input id="image-upload" name="images" type="file" multiple className="sr-only" onChange={handleImageChange} />
              </label>
            </div>
          </div>
          <div className="items-center px-4 py-3 sm:flex sm:justify-end sm:space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary sm:w-auto transform hover:scale-105 transition duration-300"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm transform hover:scale-105 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProduct;
