// Import the dbClient and redisClient from utils/db.js and utils/redis.js
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

import crypto from 'crypto';

import { v4 as uuidv4 } from 'uuid';

class AuthController {
  /**
   * Define a static method getConnect that signs-in the user by generating a new authentication token
   * @param {object} req - The request object from Express
   * @param {object} res - The response object from Express
   */
  static async getConnect (req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const [email, password] = Buffer.from(authHeader.slice(6), 'base64')
      .toString()
      .split(':');

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const user = await dbClient.users.findOne({ email, password: hashedPassword });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = uuidv4();

    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 3600);

    res.status(200).json({ token });
  }

  /**
   * Define a static method getDisconnect that signs-out the user based on the token
   * @param {object} req - The request object from Express
   * @param {object} res - The response object from Express
   */
  static async getDisconnect (req, res) {
    const token = req.headers['x-token'];

    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await redisClient.del(`auth_${token}`);

    res.status(204).end();
  }
}

export default AuthController;
