// Auth Middleware - Extracts user ID from headers
const authMiddleware = (req, res, next) => {
    const userId = req.query.userId || req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = userId;
    next();
};

export default authMiddleware;
