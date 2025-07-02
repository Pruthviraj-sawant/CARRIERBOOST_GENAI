import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Code, Github, Trophy, BarChart3, Code2 } from 'lucide-react';
// FIX THIS LINE
import { Settings as SettingsIcon } from 'lucide-react'; // ← rename the icon
import ProfileSettings from '../pages/ProfileSettings'; // ← your actual component


import LeetCodeProfile from '../components/platforms/leetcode';
import CodeforcesProfile from '../components/platforms/CodeforcesProfileDashboard';
import GithubProfile from '../components/platforms/github';
import CodeChefProfileDashboard from '../components/platforms/CodeChefProfileDashboard';
import HackerRankProfileDashboard from '../components/platforms/HackerRankProfileDashboard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('leetcode');
  const [userLinks, setUserLinks] = useState({});
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: 'leetcode', label: 'LeetCode', icon: <Code size={16} /> },
    { key: 'codeforces', label: 'Codeforces', icon: <BarChart3 size={16} /> },
    { key: 'github', label: 'GitHub', icon: <Github size={16} /> },
    { key: 'codechef', label: 'CodeChef', icon: <Trophy size={16} /> },
    { key: 'hackerrank', label: 'HackerRank', icon: <Code2 size={16} /> },
    { key: 'settings', label: 'Profile Settings', icon: <SettingsIcon size={16} /> },


  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/profile', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
        setUserLinks({
          leetcode: res.data.leetcode,
          codeforces: res.data.codeforces,
          github: res.data.github,
          codechef: res.data.codechef,
          hackerrank: res.data.hackerrank,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const renderActiveTab = () => {
    if (loading) {
      return <p className="text-center text-gray-500">Loading...</p>;
    }

    switch (activeTab) {
      case 'leetcode':
        return <LeetCodeProfile username={userLinks.leetcode} />;
      case 'codeforces':
        return <CodeforcesProfile username={userLinks.codeforces} />;
      case 'github':
        return <GithubProfile username={userLinks.github} />;
      case 'codechef':
        return <CodeChefProfileDashboard username={userLinks.codechef} />;
      case 'hackerrank':
        return <HackerRankProfileDashboard username={userLinks.hackerrank} />;
        case 'settings':
  return <ProfileSettings userLinks={userLinks} setUserLinks={setUserLinks} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          🚀 Competitive Programming Dashboard
        </h1>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-10">
          <div className="flex flex-wrap justify-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 border border-gray-100">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
