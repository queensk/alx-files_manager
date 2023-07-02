import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

class UsersController {
  /**
   * Define a static method postNew that creates a new user in DB
   * @param {object} req - The request object from Express
   * @param {object} res - The response object from Express
   */
  static async postNew (req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const user = await dbClient.users.findOne({ email });
    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    const newUser = await dbClient.users.insertOne({ email, password: hashedPassword });
    res.status(201).json({ id: newUser.insertedId, email });
  }

  /**
   * Define a static method getMe that retrieves the user based on the token used
   * @param {object} req - The request object from Express
   * @param {object} res - The response object from Express
   */
  static async getMe (req, res) {
    const token = req.headers['x-token'];

    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await dbClient.users.findOne({ _id: ObjectId(userId) });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
