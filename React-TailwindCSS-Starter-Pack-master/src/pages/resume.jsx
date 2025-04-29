import React, { useState } from 'react';
import UploadResume from '../components/resume/UploadResume';
import FeedbackDisplay from '../components/resume/FeedbackDisplay';

function Resume() {
  const [feedback, setFeedback] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">AI Resume Reviewer</h1>
      <UploadResume setFeedback={setFeedback} />
      {feedback && <FeedbackDisplay feedback={feedback} />}
    </div>
  );
}

export default Resume;
