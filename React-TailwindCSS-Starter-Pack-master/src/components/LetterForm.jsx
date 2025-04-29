import { useState } from 'react';
import { generateLetter } from '../services/api';

const LetterForm = ({ setResult }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await generateLetter(prompt);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Letter/Application Generator
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="6"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter what kind of letter you want..."
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
        >
          Generate
        </button>
      </form>
    </div>
  );
};

export default LetterForm;
