import React from 'react';

const Notification = ({ message, type }) => {
  if (!message) {
    return null;
  }

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 transform translate-y-0 opacity-100`}>
      {message}
    </div>
  );
};

export default Notification;