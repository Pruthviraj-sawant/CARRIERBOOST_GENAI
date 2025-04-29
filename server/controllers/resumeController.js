const extractTextFromPDF = require('../services/resume/extractText');
const getResumeFeedback = require('../services/resume/geminiService');

exports.uploadResume = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const text = await extractTextFromPDF(fileBuffer);
    const feedback = await getResumeFeedback(text);

    res.json({ feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
};
