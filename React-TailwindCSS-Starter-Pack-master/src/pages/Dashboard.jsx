import React, { useState } from 'react';
import { Code, Github, Trophy, BarChart3, Code2 } from 'lucide-react';

import LeetCodeProfile from '../components/platforms/leetcode';
import CodeforcesProfile from '../components/platforms/CodeforcesProfileDashboard';
import GithubProfile from '../components/platforms/github';
import CodeChefProfilebashboard from '../components/platforms/CodeChefProfileDashboard';
import HackerRankProfileDashboard from '../components/platforms/HackerRankProfileDashboard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('leetcode');

  const tabs = [
    { key: 'leetcode', label: 'LeetCode', icon: <Code size={16} /> },
    { key: 'codeforces', label: 'Codeforces', icon: <BarChart3 size={16} /> },
    { key: 'github', label: 'GitHub', icon: <Github size={16} /> },
    { key: 'codechef', label: 'CodeChef', icon: <Trophy size={16} /> },
    { key: 'hackerrank', label: 'HackerRank', icon: <Code2 size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">🚀 Competitive Programming Dashboard</h1>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-10">
          <div className="flex flex-wrap justify-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Platform Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 border border-gray-100">
          {activeTab === 'leetcode' && <LeetCodeProfile />}
          {activeTab === 'codeforces' && <CodeforcesProfile />}
          {activeTab === 'github' && <GithubProfile />}
          {activeTab === 'codechef' && <CodeChefProfilebashboard />}
          {activeTab === 'hackerrank' && <HackerRankProfileDashboard />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
