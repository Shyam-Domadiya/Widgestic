import express from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, analyticsController.getDashboardStats);

export default router;
