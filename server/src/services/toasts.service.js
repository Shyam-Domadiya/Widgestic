import Toast from '../models/Toast.js';

const TOAST_LIMIT = 3;

export const getToastsByUser = async (userId) => {
    return Toast.find({ userId });
};

export const createToast = async (userId, toastData) => {
    const count = await Toast.countDocuments({ userId, status: 'ACTIVE' });
    if (count >= TOAST_LIMIT) throw new Error('Limit reached');

    // Sanitize data to prevent ID collisions
    const { _id, __v, ...sanitizedData } = toastData;
    const newToast = new Toast({ userId, ...sanitizedData });
    await newToast.save();
    return newToast;
};

export const updateToast = async (toastId, userId, updateData) => {
    return Toast.findOneAndUpdate(
        { _id: toastId, userId },
        updateData,
        { new: true }
    );
};

export const deleteToast = async (toastId, userId) => {
    return Toast.findOneAndDelete({ _id: toastId, userId });
};

import DailyStat from '../models/DailyStat.js';

export const recordView = async (toastId) => {
    const date = new Date().toISOString().split('T')[0];
    await DailyStat.findOneAndUpdate(
        { toastId, date },
        { $inc: { views: 1 } },
        { upsert: true }
    );
    return Toast.findByIdAndUpdate(toastId, { $inc: { views: 1 } });
};

export const recordClick = async (toastId) => {
    const date = new Date().toISOString().split('T')[0];
    await DailyStat.findOneAndUpdate(
        { toastId, date },
        { $inc: { clicks: 1 } },
        { upsert: true }
    );
    return Toast.findByIdAndUpdate(toastId, { $inc: { clicks: 1 } });
};

export const recordDismissal = async (toastId) => {
    const date = new Date().toISOString().split('T')[0];
    await DailyStat.findOneAndUpdate(
        { toastId, date },
        { $inc: { dismissals: 1 } },
        { upsert: true }
    );
    return Toast.findByIdAndUpdate(toastId, { $inc: { dismissals: 1 } });
};
