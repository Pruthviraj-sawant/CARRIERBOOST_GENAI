// src/components/UploadResume.js
import React, { useState } from 'react';
import { uploadResume } from '../../services/api';

function UploadResume({ setFeedback }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    try {
      const data = await uploadResume(file);
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error uploading resume:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input 
        type="file" 
        accept=".pdf" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button 
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Upload Resume
      </button>
    </div>
  );
}

export default UploadResume;
