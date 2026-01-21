import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Simple validation
        if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ email, password });
        await newUser.save();

        res.status(201).json({ user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
