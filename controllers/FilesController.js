import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import { ObjectId } from 'mongodb';

import fs from 'fs';

import path from 'path';

import { v4 as uuidv4 } from 'uuid';

class FilesController {
  /**
   * Define a static method postUpload that creates a new file in DB and in disk
   * @param {object} req - The request object from Express
   * @param {object} res - The response object from Express
   */
  static async postUpload (req, res) {
    const token = req.headers['x-token'];

    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, type, parentId, isPublic, data } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Missing name' });
      return;
    }

    const validTypes = ['folder', 'file', 'image'];
    if (!type || !validTypes.includes(type)) {
      res.status(400).json({ error: 'Missing type' });
      return;
    }

    if (!data && type !== 'folder') {
      res.status(400).json({ error: 'Missing data' });
      return;
    }

    let parentFile = null;
    if (parentId) {
      parentFile = await dbClient.findFile({ _id: parentId });
      if (!parentFile) {
        res.status(400).json({ error: 'Parent not found' });
        return;
      }
      if (parentFile.type !== 'folder') {
        res.status(400).json({ error: 'Parent is not a folder' });
        return;
      }
    }

    const newFile = {
      userId,
      name,
      type,
      parentId: parentId || 0,
      isPublic: isPublic || false
    };

    if (type === 'folder') {
      await dbClient.files.insertOne(newFile);
      res.status(201).json(newFile);
      return;
    }

    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileName = uuidv4();

    const localPath = path.join(folderPath, fileName);

    fs.writeFileSync(localPath, Buffer.from(data, 'base64'));

    newFile.localPath = localPath;

    await dbClient.files.insertOne(newFile);

    res.status(201).json(newFile);
  }

  /**
   * Retrieve the file document based on the ID
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static async getShow (req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const fileId = req.params.id;
    const file = await dbClient.files.findOne({ _id: ObjectId(fileId), userId: ObjectId(userId) });
    if (!file) return res.status(404).json({ error: 'Not found' });

    return res.json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId
    });
  }

  /**
       * Retrieve all users file documents for a specific parentId and with pagination
       * @param {object} req - The request object
       * @param {object} res - The response object
       */
  static async getIndex (req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const parentId = req.query.parentId || 0;
    const page = req.query.page || 0;

    const files = await dbClient.files.aggregate([
      { $match: { userId: ObjectId(userId), parentId } },
      { $skip: page * 20 },
      { $limit: 20 },
      {
        $project: {
          id: '$_id',
          userId: '$userId',
          name: '$name',
          type: '$type',
          isPublic: '$isPublic',
          parentId: '$parentId'
        }
      }
    ]).toArray();

    return res.json(files);
  }

  /**
   * Set isPublic to true on the file document based on the ID
   * @param {object} req - The request object
   * @param {object} res - The response object
   */
  static async putPublish (req, res) {
    // Retrieve the user based on the token
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Retrieve the file document based on the ID
    const fileId = req.params.id;
    const file = await dbClient.files.findOne({ _id: ObjectId(fileId), userId: ObjectId(userId) });
    if (!file) return res.status(404).json({ error: 'Not found' });

    // Update the value of isPublic to true
    await dbClient.db.files.updateOne({ _id: ObjectId(fileId), userId: ObjectId(userId) }, { $set: { isPublic: true } });

    // Return the file document with a status code 200
    return res.status(200).json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: true,
      parentId: file.parentId
    });
  }

  /**
     * Set isPublic to false on the file document based on the ID
     * @param {object} req - The request object
     * @param {object} res - The response object
     */
  static async putUnpublish (req, res) {
    // Retrieve the user based on the token
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Retrieve the file document based on the ID
    const fileId = req.params.id;
    const file = await dbClient.files.findOne({ _id: ObjectId(fileId), userId: ObjectId(userId) });
    if (!file) return res.status(404).json({ error: 'Not found' });

    // Update the value of isPublic to false
    await dbClient.files.updateOne({ _id: ObjectId(fileId), userId: ObjectId(userId) }, { $set: { isPublic: false } });

    // Return the file document with a status code 200
    return res.status(200).json({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: false,
      parentId: file.parentId
    });
  }
}

export default FilesController;
