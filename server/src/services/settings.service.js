import Settings from '../../models/Settings.js';

const DEFAULT_SETTINGS = {
    timeBetweenToasts: 3,
    toastDisplayTime: 5,
    position: 'bottom-right',
    backgroundColor: '#ffffff',
    typography: 'Inter, sans-serif',
    interactiveDismissal: true,
    brandedSignature: true
};

export const getSettingsByUser = async (userId) => {
    const settings = await Settings.findOne({ userId });
    return settings || DEFAULT_SETTINGS;
};

export const updateSettings = async (userId, settingsData) => {
    return Settings.findOneAndUpdate(
        { userId },
        { $set: settingsData },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
};
