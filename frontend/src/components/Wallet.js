import React, { useState, useEffect } from 'react';
import api from '../api'; // Use the centralized api instance
import { useAuth } from '../context/AuthContext';

const Wallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get(`/api/wallet/${user.id}`);
        setWallet(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchWallet();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!wallet) {
    return <div>No wallet found.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Wallet</h2>
      <div className="text-lg font-semibold mb-4">Balance: ${wallet.balance.toFixed(2)}</div>
      <h3 className="text-xl font-bold mb-2">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Product</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Commission</th>
              <th className="py-2 px-4 border-b">Final Amount</th>
            </tr>
          </thead>
          <tbody>
            {wallet.transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="py-2 px-4 border-b">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{tx.productId}</td>
                <td className="py-2 px-4 border-b">{tx.quantity}</td>
                <td className="py-2 px-4 border-b">${tx.total.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">-${tx.commission.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">${tx.finalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;
