import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../utils/categories';

const Categories = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <Link to={`/products?category=${category.name}`} key={category.name} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
            <div className="h-48 flex items-center justify-center bg-light-gray">
              <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-base-text">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;