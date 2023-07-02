import { Router } from 'express';

import AppController from '../controllers/AppController.js';

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

export default router;
