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
    const redisOptions = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retry_unfulfilled_commands: true,
      retryDelayOnFailover: 1000,
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
      lazyConnect: true, // Don't connect immediately
      retryStrategy: (times) => {
        // Retry after 2 seconds, up to 5 times
        if (times < 5) {
          return 2000;
        }
        console.log('Redis retry limit exceeded, continuing without caching');
        return null; // Stop retrying
      }
    };

    // Add password if provided
    if (process.env.REDIS_PASSWORD) {
      redisOptions.password = process.env.REDIS_PASSWORD;
    }

    // Create client
    const client = Redis.createClient(redisOptions);

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