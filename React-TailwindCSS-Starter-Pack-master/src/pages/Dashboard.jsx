import React, { useState } from 'react';
import LeetCodeProfile from '../components/platforms/leetcode';
// import CodeforcesProfile from '../components/CodeforcesProfile';
import GithubProfile from '../components/platforms/github';
import CodingProfileTracker from '../pages/codingprofile';

const Dashboard = () => {
  
  return (
    <div className="h-full w-full">
     <CodingProfileTracker/>
    </div>
  );
};

export default Dashboard;
