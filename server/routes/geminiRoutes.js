const express = require('express');
const { askGemini } = require('../controllers/geminiController');

const router = express.Router();

router.post('/', askGemini);

module.exports = router;
