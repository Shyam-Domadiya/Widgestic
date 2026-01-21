import express from 'express';
import authRoutes from './auth.routes.js';
import toastsRoutes from './toasts.routes.js';
import settingsRoutes from './settings.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/toasts', toastsRoutes);
router.use('/settings', settingsRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
