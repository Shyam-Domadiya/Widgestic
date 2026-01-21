import express from 'express';
import * as toastsController from '../controllers/toasts.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, toastsController.getToasts);
router.post('/', authMiddleware, toastsController.createToast);
router.put('/:id', authMiddleware, toastsController.updateToast);
router.delete('/:id', authMiddleware, toastsController.deleteToast);

// Analytics (no auth needed for widget script)
router.post('/:id/view', toastsController.recordView);
router.post('/:id/click', toastsController.recordClick);
router.post('/:id/dismiss', toastsController.recordDismissal);

export default router;
