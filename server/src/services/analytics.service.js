import DailyStat from '../models/DailyStat.js';
import Toast from '../../models/Toast.js';

export const getDailyStats = async (userId, days = 7) => {
    // 1. Get all toast IDs for this user
    const toasts = await Toast.find({ userId }).select('_id designation');
    const toastIds = toasts.map(t => t._id);

    // 2. Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    // 3. Fetch stats
    const stats = await DailyStat.find({
        toastId: { $in: toastIds },
        date: { $gte: startStr, $lte: endStr }
    }).sort({ date: 1 });

    // 4. Format for Chart (Group by Date)
    // Structure: [{ date: '2023-10-01', views: 100, clicks: 5 }, ...]
    const dateMap = {};
    
    // Fill with empty days first to ensure continuous line
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        dateMap[dateStr] = { date: dateStr, views: 0, clicks: 0, dismissals: 0 };
    }

    stats.forEach(stat => {
        if (dateMap[stat.date]) {
            dateMap[stat.date].views += stat.views;
            dateMap[stat.date].clicks += stat.clicks;
            dateMap[stat.date].dismissals += stat.dismissals;
        }
    });

    return Object.values(dateMap);
};
