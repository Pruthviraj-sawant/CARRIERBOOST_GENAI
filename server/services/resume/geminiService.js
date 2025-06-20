const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getResumeFeedback(resumeText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `
You are an expert resume reviewer.

Analyze the following resume and:
1. Summarize the candidate's strengths.
2. Suggest at least 5 improvements.
3. Rewrite 2-3 bullet points professionally.
4. Do not include **like this** in the response.
5. Use bold for subpoints, and normal text for main points.
6. Provide ATS score of resume in percentage.
7. Provide a summary of the resume in 2-3 lines.
8. Finally, rewrite the entire resume content optimized for 80%+ ATS score (not LaTeX, just plain text with bullet formatting).

Resume:
"""
${resumeText}
"""
`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

module.exports = getResumeFeedback;
