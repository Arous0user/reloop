import React, { useState, useEffect } from 'react';
import api from '../../api'; // Use the centralized api instance

const WithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/api/admin/withdrawals');
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/api/admin/withdrawals/${id}`, { status });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Withdrawal Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Seller</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td className="py-2 px-4 border-b">{new Date(req.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{req.user.name}</td>
                <td className="py-2 px-4 border-b">${req.amount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">{req.status}</td>
                <td className="py-2 px-4 border-b">
                  {req.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(req.id, 'COMPLETED')}
                        className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(req.id, 'FAILED')}
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalRequests;
