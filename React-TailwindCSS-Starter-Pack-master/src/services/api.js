import axios from 'axios';

export const generateLetter = async (prompt) => {
  const response = await axios.post('http://localhost:5000/api/ask', { prompt });
  return response.data.text;
};

// src/services/backendAPI.js
export const getInterviewQuestion = async (previousAnswer) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/gemini', // API endpoint
      { previousAnswer },                 // Data sent in request body
      {
        headers: {
          'Content-Type': 'application/json', // Setting headers
        },
      }
    );

    return response.data.question; // Assuming API sends { question: "..." }
  } catch (error) {
    console.error('Error getting interview question:', error);
    throw new Error('Failed to fetch interview question');
  }
};



export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await axios.post('http://localhost:5000/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
}