import { Router } from 'express';

import AppController from '../controllers/AppController.js';

import UsersController from '../controllers/UsersController.js';

const router = Router();

/**
 * Define the GET /status endpoint that calls AppController.getStatus
 * @param {string} path - The path of the endpoint
 * @param {function} handler - The handler function for the endpoint
 */
router.get('/status', (req, res) => {
  AppController.getStatus(req, res);
});

/**
 * Define the GET /stats endpoint that calls AppController.getStats
 * @param {string} path - The path of the endpoint
 * @param {function} handler - The handler function for the endpoint
 */
router.get('/stats', (req, res) => {
  AppController.getStats(req, res);
});

/**
 * Define the POST /users endpoint that calls UsersController.postNew
 * @param {string} path - The path of the endpoint
 * @param {function} handler - The handler function for the endpoint
 */
router.post('/users', (req, res) => {
  UsersController.postNew(req, res);
});

export default router;
