// server/routes/authRoutes.js
const express = require('express');
const { login } = require('../controllers/authController');
const { register } = require('../controllers/authController'); // Import register function
const router = express.Router();

// POST /login route
router.post('/login', login);
router.post('/register',register);

module.exports = router;
