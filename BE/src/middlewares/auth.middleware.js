const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem có Authorization header hay không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Nếu không có token -> lỗi
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

const customerMiddleware = async (req, res, next) => {
    if (!req.user || req.user.role !== 'customer') {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }
    else{
        next();
    }
};

const adminMiddleware = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }
    else{
        next();
    }
};

module.exports = {
    protect,
    customerMiddleware,
    adminMiddleware
};