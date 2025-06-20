// src/App.js
import React, { useState } from 'react';
import InterviewQuestion from '../components/video/InterviewQuestion';
import VideoStream from '../components/video/videostram';
import { getInterviewQuestion } from '../services/api';

function Video() {
  const [currentQuestion, setCurrentQuestion] = useState('Tell me about yourself.');
  const [userAnswer, setUserAnswer] = useState('');

  // Function to simulate submitting answer and getting next question
  const handleSubmitAnswer = async () => {
    if (userAnswer.trim() === '') return;

    try {
      const nextQuestion = await getInterviewQuestion(userAnswer);
      setCurrentQuestion(nextQuestion);
      setUserAnswer('');  // Clear the input for next answer
    } catch (error) {
      console.error('Error fetching next question:', error);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">AI Interviewer</h1>

      {/* Video Streaming Component */}
      <h1 className="text-2xl font-semibold mb-4">Video Stream interview through audio</h1>
      {/* <VideoStream /> */}

      <InterviewQuestion  />

      {/* Interview Question */}

      </div>

<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
      <h1 className="text-3xl font-bold mb-6">AI Interviewer</h1>

{/* Video Streaming Component */}
<h1 className="text-2xl font-semibold mb-4"> interview through TEXT</h1>
      <div className="mt-6 p-4 bg-white rounded shadow-md w-full max-w-2xl text-center">
        <h2 className="text-xl font-semibold mb-4">Current Question:</h2>
        <p className="text-gray-700">{currentQuestion}</p>
      </div>

      {/* Answer Input */}
      <div className="mt-6 w-full max-w-2xl">
        <textarea
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="4"
          placeholder="Speak or type your answer here..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />

        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={handleSubmitAnswer}
        >
          Submit Answer
        </button>
      </div>
      </div>
    </div>
  );
}

export default Video;
