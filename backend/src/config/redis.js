/**
 * Redis Configuration
 * 
 * This file contains the Redis client configuration for caching.
 */

const Redis = require('redis');

// Create Redis client
const createRedisClient = () => {
  // If Redis is explicitly disabled via environment variable, return null
  if (process.env.REDIS_ENABLED === 'false') {
    console.log('Redis is disabled via REDIS_ENABLED=false');
    return null;
  }

  try {
    // Configuration options
    const client = Redis.createClient({
      url: process.env.REDIS_URL
    });

    // Event handlers
    client.on('error', (err) => {
      console.warn('Redis Client Error (continuing without caching):', err.message);
    });

    client.on('connect', () => {
      console.log('Redis Client Connected');
    });

    client.on('reconnecting', () => {
      console.log('Redis Client Reconnecting...');
    });

    client.on('ready', () => {
      console.log('Redis Client Ready');
    });

    return client;
  } catch (error) {
    console.warn('Failed to create Redis client (continuing without caching):', error.message);
    return null;
  }
};

module.exports = { createRedisClient };