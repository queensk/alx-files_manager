// Import the Express Router
import { Router } from 'express';

import AppController from '../controllers/AppController.js';

import UsersController from '../controllers/UsersController.js';

import AuthController from '../controllers/AuthController.js';

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

/**
 * Define the GET /connect endpoint that calls AuthController.getConnect
 * @param {string} path - The path of the endpoint
 * @param {function} handler - The handler function for the endpoint
 */
router.get('/connect', (req, res) => {
  AuthController.getConnect(req, res);
});

/**
 * Define the GET /disconnect endpoint that calls AuthController.getDisconnect
 * @param {string} path - The path of the endpoint
 * @param {function} handler - The handler function for the endpoint
 */
router.get('/disconnect', (req, res) => {
  AuthController.getDisconnect(req, res);
});

/**
 * Define the GET /users/me endpoint that calls UsersController.getMe
 * @param {string} path - The path of the endpoint
 * @param {function} handler - The handler function for the endpoint
 */
router.get('/users/me', (req, res) => {
  UsersController.getMe(req, res);
});

export default router;
