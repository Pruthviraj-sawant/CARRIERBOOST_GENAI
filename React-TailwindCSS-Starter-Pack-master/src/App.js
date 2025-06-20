import Home from './pages/Home';
import Video from './pages/video';
import Resume from './pages/resume';
import LeetCodeProfileFetcher from './components/platforms/leetcode';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './pages/hero';
import './App.css';
import React from 'react';
import Footer from './components/footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

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
            {/* <Route path="/leetecode-traker" element={<LeetCodeProfileFetcher/>} /> */}
          
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register />} />
            

            <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

        </Routes>
          
  <Footer/>
      </div>
    </Router>

    </>
  );
}

export default App;
