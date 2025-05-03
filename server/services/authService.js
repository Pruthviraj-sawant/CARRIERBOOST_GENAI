// server/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../config/User');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '1h' });
};

// Authenticate User (check password)
const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }

  return user;
};


const registerUser = async ({ username, email, password }) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('User already exists');
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
  
    return await user.save();
  };

module.exports = { authenticateUser, generateToken , registerUser};
