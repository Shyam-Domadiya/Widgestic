import * as toastsService from '../services/toasts.service.js';

export const getToasts = async (req, res) => {
    try {
        const toasts = await toastsService.getToastsByUser(req.userId);
        res.json(toasts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createToast = async (req, res) => {
    try {
        const toast = await toastsService.createToast(req.userId, req.body);
        res.status(201).json(toast);
    } catch (err) {
        const status = err.message === 'Limit reached' ? 403 : 500;
        res.status(status).json({ message: err.message });
    }
};

export const updateToast = async (req, res) => {
    try {
        const toast = await toastsService.updateToast(req.params.id, req.userId, req.body);
        res.json(toast);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteToast = async (req, res) => {
    try {
        await toastsService.deleteToast(req.params.id, req.userId);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const recordView = async (req, res) => {
    try {
        await toastsService.recordView(req.params.id);
        res.status(200).json({ message: 'View recorded' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const recordClick = async (req, res) => {
    try {
        await toastsService.recordClick(req.params.id);
        res.status(200).json({ message: 'Click recorded' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const recordDismissal = async (req, res) => {
    try {
        await toastsService.recordDismissal(req.params.id);
        res.status(200).json({ message: 'Dismissal recorded' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
