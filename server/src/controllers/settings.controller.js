import * as settingsService from '../services/settings.service.js';

export const getSettings = async (req, res) => {
    try {
        const settings = await settingsService.getSettingsByUser(req.userId);
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const settings = await settingsService.updateSettings(req.userId, req.body);
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
