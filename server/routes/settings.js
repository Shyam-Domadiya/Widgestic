import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

const getUser = (req, res, next) => {
    const userId = req.query.userId || req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = userId;
    next();
};

router.get('/', getUser, async (req, res) => {
    try {
        let settings = await Settings.findOne({ userId: req.userId });
        if (!settings) {
            // Return defaults if no settings found
            return res.json({
                timeBetweenToasts: 3,
                toastDisplayTime: 5,
                position: 'bottom-right',
                backgroundColor: '#ffffff',
                typography: 'Inter, sans-serif',
                interactiveDismissal: true,
                brandedSignature: true
            });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/', getUser, async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            { userId: req.userId },
            { $set: req.body },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
