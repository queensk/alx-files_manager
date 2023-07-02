import redis from 'redis';

/**
 * A class that represents a Redis client.
 */
class RedisClient {
  /**
   * Creates a new Redis client instance and handles any errors.
   */
  constructor () {
    // Create a new client instance
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.error(err);
    });
  }

  /**
   * Checks if the connection to Redis is alive.
   * @returns {boolean} True if the connection is alive, false otherwise.
   */
  isAlive () {
    return this.client.connected;
  }

  /**
   * Gets the value stored for a given key in Redis.
   * @async
   * @param {string} key - The key to get the value for.
   * @returns {Promise<string>} A promise that resolves with the value, or rejects with an error.
   */
  async get (key) {
    // Use a promise to wrap the get method of the client
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) reject(err);
        resolve(value);
      });
    });
  }

  /**
   * Sets a value for a given key in Redis, with an expiration time.
   * @async
   * @param {string} key - The key to set the value for.
   * @param {string} value - The value to set.
   * @param {number} duration - The duration in seconds for the expiration time.
   * @returns {Promise<string>} A promise that resolves with 'OK', or rejects with an error.
   */
  async set (key, value, duration) {
    // Use a promise to wrap the setex method of the client
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }

  /**
   * Deletes a value for a given key in Redis.
   * @async
   * @param {string} key - The key to delete the value for.
   * @returns {Promise<number>} A promise that resolves with the number of keys deleted, or rejects with an error.
   */
  async del (key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }
}

const redisClient = new RedisClient();

export default redisClient;
