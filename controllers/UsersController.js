import dbClient from '../utils/db.js';

import crypto from 'crypto';

class UsersController {
  /**
   * Define a static method postNew that creates a new user in DB
   * @param {object} req - The request object from Express
   * @param {object} res - The response object from Express
   */
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const user = await dbClient.findUser({ email });
    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    const newUser = await dbClient.createUser({ email, password: hashedPassword });
    res.status(201).json({ id: newUser.insertedId, email });
  }
}

export default UsersController;
