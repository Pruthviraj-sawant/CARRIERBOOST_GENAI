// // backend/routes/geminiRoutes.js
// const express = require('express');
// const { generateQuestion } = require('../services/videostreamservvice');

// const router = express.Router();

// router.post('/', async (req, res) => {
//   const { previousAnswer } = req.body;
//   try {
//     const question = await generateQuestion(previousAnswer);
//     res.json({ question });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching question from Google Gemini.' });
//   }
// });

// module.exports = router;
// backend/routes/geminiRoutes.js
const express = require('express');
const { generateQuestion } = require('../services/videostreamservvice'); // fixed typo here

const router = express.Router();

// POST route to generate new interview question
router.post('/', async (req, res) => {
  const { previousAnswer } = req.body;

  if (!previousAnswer) {
    return res.status(400).json({ message: 'Previous answer is required.' });
  }

  try {
    const question = await generateQuestion(previousAnswer);
    res.json({ question });
  } catch (error) {
    console.error('Error in /generate-question route:', error.message);
    res.status(500).json({ message: 'Error fetching question from Google Gemini.' });
  }
});

module.exports = router;
