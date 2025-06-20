const axios = require('axios');
const { GEMINI_API_KEY } = require('../config/geminiConfig');

const generateLetter = async (prompt) => {
  const lowerPrompt = prompt.toLowerCase().trim();

  // List of common questions we want to intercept
  const identityQuestions = [
    'who are you',
    'what is your name',
    'who built you',
    'who created you',
    'tell me about yourself'
  ];

  // Check if prompt matches any identity question
  const isIdentityQuestion = identityQuestions.some((question) =>
    lowerPrompt.includes(question)
  );

  if (isIdentityQuestion) {
    return `Dear User,

I am a Letter Generator made by SparkelsUI. 
My purpose is to assist you in generating various types of letters based on your inputs.

Best Regards,
The SparkelsUI Team`;
  }

  // Otherwise, proceed to call Gemini API
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedText = response.data.candidates[0]?.content?.parts[0]?.text;

    // Format the letter with a formal structure (Header, Body, Footer)
    const formattedLetter = `
     Dear User,
     Thank you for your request. Here is the generated letter based on your input:

${generatedText}

Best Regards,
Your Friendly Letter Generator`;

    return formattedLetter;

  } catch (error) {
    console.error('Error generating letter:', error);
    return "Sorry, there was an error generating the letter. Please try again later.";
  }
};

module.exports = { generateLetter };
