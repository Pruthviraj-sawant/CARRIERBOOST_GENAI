const { generateLetter } = require('../services/geminiService');

const askGemini = async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await generateLetter(prompt);
    res.json({ text: result });
  } catch (error) {
    console.error('Gemini Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { askGemini };
