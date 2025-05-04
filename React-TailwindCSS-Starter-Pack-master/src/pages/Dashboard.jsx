import React, { useState } from 'react';
import LeetCodeProfile from '../components/platforms/leetcode';
import CodeforcesProfile from '../components/platforms/CodeforcesProfileDashboard';
import GithubProfile from '../components/platforms/github';
import CodeChefProfilebashboard from '../components/platforms/CodeChefProfileDashboard';
import HackerRankProfileDashboard from '../components/platforms/HackerRankProfileDashboard';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('leetcode');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Competitive Programming Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('leetcode')}
          className={`px-4 py-2 rounded ${activeTab === 'leetcode' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          LeetCode
        </button>
        <button
          onClick={() => setActiveTab('codeforces')}
          className={`px-4 py-2 rounded ${activeTab === 'codeforces' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Codeforces
        </button>
        <button
          onClick={() => setActiveTab('github')}
          className={`px-4 py-2 rounded ${activeTab === 'github' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          GitHub
        </button>
        <button
          onClick={() => setActiveTab('codechef')}
          className={`px-4 py-2 rounded ${activeTab === 'codechef' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          codechef
        </button>
        <button
          onClick={() => setActiveTab('hackerrank')}
          className={`px-4 py-2 rounded ${activeTab === 'hackerrank' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          hackerrank
        </button>
      </div>

      <div>
        {activeTab === 'leetcode' && <LeetCodeProfile />}
        {activeTab === 'codeforces' && <CodeforcesProfile />}
        {activeTab === 'github' && <GithubProfile />}
        {activeTab === 'codechef' && <CodeChefProfilebashboard />}
        {activeTab === 'hackerrank' && <HackerRankProfileDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
