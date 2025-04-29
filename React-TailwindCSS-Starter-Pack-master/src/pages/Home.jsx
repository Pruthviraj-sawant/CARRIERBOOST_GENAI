import { useState } from 'react';
import LetterForm from '../components/LetterForm';
import ResultDisplay from '../components/ResultDisplay';
import Navbar from '../components/Navbar';

const Home = () => {
  const [result, setResult] = useState('');

  return (
  <div>
    
    <div style={{ padding: 20 }}>
      
      <LetterForm setResult={setResult} />
      <ResultDisplay result={result} />
    </div>
    </div>
  );
};

export default Home;
