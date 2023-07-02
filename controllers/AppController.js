import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

class AppController {
  /**
   * Define a static method getStatus that returns the status of Redis and MongoDB
   * @param {object} req - The request object from Express
   * @param {object} res - The response object from Express
   */
  static async getStatus (req, res) {
    const redisStatus = await redisClient.isAlive();
    const dbStatus = await dbClient.isAlive();
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  /**
   * Define a static method getStats that returns the number of users and files in MongoDB
   * @param {object} req - The request object from Express
   * @param {object} res - The response object from Express
   */
  static async getStats (req, res) {
    const nbUsers = await dbClient.nbUsers();
    const nbFiles = await dbClient.nbFiles();
    res.status(200).json({ users: nbUsers, files: nbFiles });
  }
}

export default AppController;
