const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const { updateProfile, getProfile } = require('../controllers/userController');

router.put('/profile', authMiddleware, updateProfile);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
