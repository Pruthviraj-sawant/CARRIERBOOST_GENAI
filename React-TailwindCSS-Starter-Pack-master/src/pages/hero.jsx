// import React from 'react';
// import { Link } from 'react-router-dom';
// import { AsteroidBelt, RealisticMeteors ,ThunderScene,Jelly,HackerBackground} from "sparkels_ui";

// const features = [
//   {
//     title: 'Feature Letter Generator',
//     description: 'Generate professional feature letters in seconds with customizable templates.',
//     link: '/letter-generator',
//   },
//   {
//     title: 'Resume Checker',
//     description: 'Upload your resume and get AI-powered suggestions to improve it instantly.',
//     link: '/resume-chechker',
//   },
//   {
//     title: 'AI Interviewer',
//     description: 'Simulate real-time interviews with an AI to boost your confidence and readiness.',
//     link: '/ai-interviewer',
//   },
//   {
//     title: 'LeetCode Profile Tracker',
//     description: 'Track your LeetCode progress, compare stats, and stay consistent with coding.',
//     link: '/leetcode-tracker',
//   },
// ];

// const Hero = () => {
//   return (
//     <div className="overflow-hidden flex flex-col items-center justify-center relative ">
         
//          <h1 className="text-4xl font-bold text-gray-800 mb-4 absolute z-10 text-center text-[5rem] ">Welcome to CareerBoost</h1>
       
// <div className='z-0'>
//         <AsteroidBelt  />
    
   
//         </div>
//       <div className=" mx-auto text-center">
       
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
//             >
//               <h2 className="text-2xl font-semibold text-blue-600 mb-2">{feature.title}</h2>
//               <p className="text-gray-600 mb-4">{feature.description}</p>
//               <Link
//                 to={feature.link}
//                 className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//               >
//                 Explore
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;
import React, { useState, useEffect } from 'react';
import { AsteroidBelt, RealisticMeteors, ThunderScene, Jelly, HackerBackground } from "sparkels_ui";

// Since we can't import react-router-dom, we'll create a simple Link component
const Link = ({ to, className, children }) => (
  <a href={to} className={className}>
    {children}
  </a>
);

const features = [
  {
    title: 'Feature Letter Generator',
    description: 'Generate professional feature letters in seconds with customizable templates.',
    link: '/letter-generator',
    icon: '✉️',
    bgEffect: 'meteor'
  },
  {
    title: 'Resume Checker',
    description: 'Upload your resume and get AI-powered suggestions to improve it instantly.',
    link: '/resume-chechker',
    icon: '📝',
    bgEffect: 'thunder'
  },
  {
    title: 'AI Interviewer',
    description: 'Simulate real-time interviews with an AI to boost your confidence and readiness.',
    link: '/ai-interviewer',
    icon: '🤖',
    bgEffect: 'jelly'
  },
  {
    title: 'LeetCode Profile Tracker',
    description: 'Track your LeetCode progress, compare stats, and stay consistent with coding.',
    link: '/leetcode-tracker',
    icon: '💻',
    bgEffect: 'hacker'
  },
];

const Hero = () => {
  const [activeHover, setActiveHover] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate elements in after component mounts
    setIsVisible(true);
  }, []);

  // Function to render the appropriate background effect
  const renderBgEffect = (effect, isActive) => {
    if (!isActive) return null;
    
    switch(effect) {
      case 'meteor':
        return <div className="absolute inset-0 opacity-40"></div>;
      case 'thunder':
        return <div className="absolute inset-0 opacity-40"></div>;
      case 'jelly':
        return <div className="absolute inset-0 opacity-40"></div>;
      case 'hacker':
        return <div className="absolute inset-0 opacity-40"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden flex flex-col items-center justify-center relative min-h-screen bg-gradient-to-b bg-white">
      {/* Cosmic background */}
      <div className="absolute inset-0 z-0">
        <AsteroidBelt />
      </div>
      
      {/* Animated title with glowing effect */}
      <div className={`relative z-10 mt-32 mb-[30em] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-center mb-4">
          CareerBoost
        </h1>
        <p className="text-xl text-blue-800 text-center max-w-2xl mx-auto">
          Supercharge your career journey with our AI-powered tools
        </p>
      </div>

      {/* Features grid */}
      <div className="container mx-auto px-4 pb-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative overflow-hidden bg-blue-100 bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-black ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setActiveHover(index)}
              onMouseLeave={() => setActiveHover(null)}
            >
              {/* Background effect */}
              {renderBgEffect(feature.bgEffect, activeHover === index)}
              
              {/* Content */}
              <div className="p-8 relative z-10 text-black ">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h2 className="text-2xl font-bold text-black mb-3">{feature.title}</h2>
                <p className="text-black mb-6">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center justify-center border-black border-2 hover:bg-blue-200 text-black font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Explore
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Floating badges/stats */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 z-10">
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-400">
          <span className="text-blue-300 font-semibold">🚀 10,000+ Users</span>
        </div>
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-400">
          <span className="text-blue-300 font-semibold">⭐ 4.9 Rating</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;