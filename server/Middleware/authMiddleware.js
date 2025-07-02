// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../config/User'); // Adjust the path to your User model

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure this matches your env
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    req.user = user;
    next(); // ✅ Only call next if everything is okay
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
