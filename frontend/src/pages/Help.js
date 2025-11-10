import React, { useState } from 'react';

const Help = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, ''); // Remove non-numeric characters
    setPhoneNumber(numericInput);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.match(/^\d{10}$/)) {
      alert('We will call you shortly');
      setPhoneNumber('');
      setError('');
    } else {
      setError('Please enter a valid 10-digit phone number.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        {/* ... other FAQ items ... */}
        <h2 className="text-2xl font-bold mb-4">Request a Call</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your 10-digit phone number"
              pattern="\d{10}"
              maxLength="10"
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Request Call
            </button>
          </div>
        </form>
        <h2 className="text-2xl font-bold mt-6 mb-4">Contact Us</h2>
        <p>If you have any other questions or need further assistance, please do not hesitate to contact us at <a href="mailto:reloophelp@gmail.com" className="text-primary">reloophelp@gmail.com</a>.</p>
      </div>
    </div>
  );
};

export default Help;