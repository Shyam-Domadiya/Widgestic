import * as analyticsService from '../services/analytics.service.js';

export const getDashboardStats = async (req, res) => {
    try {
        const days = req.query.days ? parseInt(req.query.days) : 7;
        const stats = await analyticsService.getDailyStats(req.userId, days);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
