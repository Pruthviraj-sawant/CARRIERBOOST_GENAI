import Home from './pages/Home';
import Video from './pages/video';
import Resume from './pages/resume';
import LeetCodeProfileFetcher from './pages/leetcode';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './pages/hero';
import './App.css';
import React from 'react';
function App() {
  return (
    <>
    
      
    <Router>  
      <div className="max-w-[100vw]">
        
      <Navbar/>
          <Routes>
            <Route path="/" element={<Hero/>} />
            <Route path="/letter-generator" element={  <Home />} />
            <Route path="/ai-interviewer" element={<Video/>} />
            <Route path="/resume-chechker" element={<Resume/>} />
            <Route path="/leetecode-traker" element={<LeetCodeProfileFetcher/>} />
          </Routes>

  
      </div>
    </Router>

    </>
  );
}

export default App;
