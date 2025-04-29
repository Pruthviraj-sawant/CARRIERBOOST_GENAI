import React from 'react';

function FeedbackDisplay({ feedback }) {
  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-2">Resume Feedback</h2>
      <p className="whitespace-pre-line">{feedback}</p>
    </div>
  );
}

export default FeedbackDisplay;
