import express from 'express';
import Toast from '../models/Toast.js';

const router = express.Router();

// Middleware to get user ID from query or header (Simple Auth)
const getUser = (req, res, next) => {
    const userId = req.query.userId || req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = userId;
    next();
};

router.get('/', getUser, async (req, res) => {
    try {
        const toasts = await Toast.find({ userId: req.userId });
        res.json(toasts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', getUser, async (req, res) => {
    try {
        const count = await Toast.countDocuments({ userId: req.userId, status: 'ACTIVE' });
        if (count >= 3) {
            return res.status(403).json({ message: 'Limit reached' });
        }

        const newToast = new Toast({
            userId: req.userId,
            ...req.body
        });
        await newToast.save();
        res.status(201).json(newToast);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', getUser, async (req, res) => {
    try {
        const updatedToast = await Toast.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        res.json(updatedToast);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Analytics: Increment Views
router.post('/:id/view', async (req, res) => {
    try {
        await Toast.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.status(200).json({ message: 'View recorded' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Analytics: Increment Clicks
router.post('/:id/click', async (req, res) => {
    try {
        await Toast.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
        res.status(200).json({ message: 'Click recorded' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Analytics: Increment Dismissals
router.post('/:id/dismiss', async (req, res) => {
    try {
        await Toast.findByIdAndUpdate(req.params.id, { $inc: { dismissals: 1 } });
        res.status(200).json({ message: 'Dismissal recorded' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', getUser, async (req, res) => {
    try {
        await Toast.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
