import React, { useState, useRef } from 'react';
import { uploadResume } from '../../services/api';

function UploadResume({ setFeedback }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      
      setFile(droppedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await uploadResume(file);
      setFeedback(data.feedback);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setError(error.message || 'Failed to upload resume. Please try again.');
      console.error('Error uploading resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors
          ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-3">
          {!file ? (
            <>
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="text-lg font-medium text-gray-700">
                Drag and drop your resume here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files (PDF only)
              </p>
            </>
          ) : (
            <>
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-lg font-medium text-gray-700">
                {file.name}
              </p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </>
          )}
        </div>
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${!file || loading
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </div>
        ) : "Upload Resume"}
      </button>
    </div>
  );
}

export default UploadResume;