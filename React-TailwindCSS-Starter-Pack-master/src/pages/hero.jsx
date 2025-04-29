import React from 'react';
import { Link } from 'react-router-dom';
import { AsteroidBelt } from "sparkels_ui";

const features = [
  {
    title: 'Feature Letter Generator',
    description: 'Generate professional feature letters in seconds with customizable templates.',
    link: '/letter-generator',
  },
  {
    title: 'Resume Checker',
    description: 'Upload your resume and get AI-powered suggestions to improve it instantly.',
    link: '/resume-chechker',
  },
  {
    title: 'AI Interviewer',
    description: 'Simulate real-time interviews with an AI to boost your confidence and readiness.',
    link: '/ai-interviewer',
  },
  {
    title: 'LeetCode Profile Tracker',
    description: 'Track your LeetCode progress, compare stats, and stay consistent with coding.',
    link: '/leetcode-tracker',
  },
];

const Hero = () => {
  return (
    <div className="overflow-hidden flex flex-col items-center justify-center relative ">
         
         <h1 className="text-4xl font-bold text-gray-800 mb-4 absolute z-10 text-center text-[5rem] ">Welcome to CareerBoost</h1>
       
<div className='z-0'>
        <AsteroidBelt  />
        </div>
      <div className=" mx-auto text-center">
       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">{feature.title}</h2>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Link
                to={feature.link}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Explore
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
