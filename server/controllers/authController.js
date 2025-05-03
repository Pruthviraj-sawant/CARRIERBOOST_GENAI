// server/controllers/authController.js
const bcrypt = require('bcrypt');
const { authenticateUser, generateToken } = require('../services/authService');
const { registerUser } = require('../services/authService');
// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};





const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
    console.log('User registered:', user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { login , register };