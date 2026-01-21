import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.registerUser(email, password);
        res.status(201).json({ user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);
        res.json({ user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
