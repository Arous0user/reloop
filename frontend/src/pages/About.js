import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About RE-loop</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="mb-4">
          RE-loop is a revolutionary marketplace dedicated to giving pre-owned electronics a new life. Our mission is to create a sustainable and affordable way for people to buy and sell gadgets, reducing electronic waste and making technology more accessible to everyone.
        </p>
        <h2 className="text-2xl font-bold mb-4">The Problem We Solve</h2>
        <p className="mb-4">
          Every year, millions of tons of electronic waste are generated, with countless functional devices being discarded. This not only harms the environment but also represents a huge loss of value. At the same time, many people are looking for affordable ways to access modern technology.
        </p>
        <p>
          RE-loop bridges this gap by providing a trusted platform for buying and selling pre-owned electronics. We connect sellers with buyers, ensuring that devices are reused and recycled, and that everyone has the opportunity to own the technology they need at a price they can afford.
        </p>
      </div>
    </div>
  );
};

export default About;
