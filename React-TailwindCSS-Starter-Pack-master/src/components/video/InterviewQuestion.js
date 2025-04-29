// src/components/InterviewQuestion.js
import React, { useState, useEffect } from 'react';
import { getInterviewQuestion } from '../../services/api';  // Fetch question from backend

const InterviewQuestion = ({ previousAnswer }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [listening, setListening] = useState(false);
  const [speechResult, setSpeechResult] = useState('');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    const fetchQuestion = async (answerToSend) => {
      setLoading(true);
      try {
        const newQuestion = await getInterviewQuestion(answerToSend);
        setQuestion(newQuestion);
      } catch (error) {
        console.error("Error fetching the question:", error);
        setQuestion('Error fetching question');
      } finally {
        setLoading(false);
      }
    };

    if (previousAnswer) {
      fetchQuestion(previousAnswer);
    }
  }, [previousAnswer]);

  useEffect(() => {
    if (!recognition) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return;
    }

    recognition.continuous = false; // only one answer at a time
    recognition.interimResults = false; // final result only
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpeechResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  }, [recognition]);

  const startListening = () => {
    if (recognition) {
      setListening(true);
      recognition.start();
    }
  };

  const sendSpeechAsAnswer = async () => {
    if (speechResult.trim()) {
      try {
        setLoading(true);
        const newQuestion = await getInterviewQuestion(speechResult);
        setQuestion(newQuestion);
        setSpeechResult('');
      } catch (error) {
        console.error("Error fetching the question with speech result:", error);
        setQuestion('Error fetching question');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md text-center">
      <h2 className="text-lg font-semibold">Current Question:</h2>
      <p className="mt-2 text-lg font-medium text-gray-700 leading-relaxed">
        {loading ? 'Loading question...' : question || 'Waiting for answer...'}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={startListening}
          disabled={listening}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {listening ? 'Listening...' : 'Start Speaking Answer'}
        </button>

        {speechResult && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">You said: <strong>{speechResult}</strong></p>
            <button
              onClick={sendSpeechAsAnswer}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestion;
