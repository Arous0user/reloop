import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';

const PurchaseHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data.orders || []);
      } catch (err) {
        setError('Failed to fetch purchase history.');
      }
      setLoading(false);
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return <div>Loading purchase history...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase History</h2>
      {orders.length > 0 ? (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">Order ID: {order.id}</p>
                  <p className="text-gray-600">Total: ${order.totalCents / 100}</p>
                </div>
                <p className="text-gray-600">Status: {order.status}</p>
              </div>
              <ul className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center">
                    <img src={`${BACKEND_URL}${item.images[0].url}`} alt={item.title} className="w-16 h-16 object-cover rounded-md mr-4" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Product purchased none</p>
      )}
    </div>
  );
};

export default PurchaseHistory;