import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import _ from 'lodash';

export default function CodingProfileTracker() {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("leetcode");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('profile');

  // Platform configs
  const platforms = {
    leetcode: {
      name: "LeetCode",
      color: "yellow",
      icon: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.111.744 1.715.744 1.314 0 2.387-1.072 2.387-2.387 0-.621-.26-1.219-.7-1.658l-2.712-2.607c-1.724-1.724-4.055-2.686-6.496-2.686-2.443 0-4.773.962-6.496 2.686l-4.334 4.363c-1.725 1.724-2.687 4.055-2.687 6.495 0 2.443.963 4.773 2.687 6.496l4.334 4.363c1.723 1.724 4.055 2.686 6.496 2.686 2.441 0 4.773-.962 6.496-2.686l2.712-2.607c.44-.439.7-1.037.7-1.658 0-1.314-1.073-2.386-2.387-2.386-.604 0-1.202.229-1.715.744z"/>
        </svg>
      )
    },
    github: {
      name: "GitHub",
      color: "purple",
      icon: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      )
    },
    codeforces: {
      name: "CodeForces",
      color: "red",
      icon: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 9c.828 0 1.5.672 1.5 1.5v6c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-6c0-.828.672-1.5 1.5-1.5h3z"/>
        </svg>
      )
    },
    hackerrank: {
      name: "HackerRank",
      color: "green",
      icon: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.286 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.279.033-.402.099v.008l-3.748 2.24c-.5.3-.795.8-.795 1.354v4.792c0 .554.295 1.056.795 1.356l3.748 2.24c.123.065.261.099.401.099s.278-.034.402-.099l3.749-2.24c.499-.3.794-.802.794-1.355V10.5c0-.553-.295-1.055-.794-1.354L14.7 6.906a.801.801 0 0 0-.405-.107zM12 8.5l2.498 1.5-2.498 1.5-2.498-1.5L12 8.5z"/>
        </svg>
      )
    }
  };

  const mockData = {
    leetcode: {
      profile: {
        username: "",
        realName: "",
        aboutMe: "Passionate algorithm enthusiast and problem solver.",
        school: "Tech University",
        company: "Tech Corp",
        jobTitle: "Software Engineer",
        countryName: "United States",
        skillTags: ["Algorithms", "Data Structures", "Dynamic Programming"]
      },
      stats: {
        totalSolved: 387,
        easySolved: 120,
        mediumSolved: 200,
        hardSolved: 67,
        acceptanceRate: 64.8,
        ranking: 24563
      },
      activity: {
        streak: 12,
        totalActiveDays: 145
      },
      badges: [
        { name: "100 Days Badge", displayName: "Century Streak" },
        { name: "Problem Solver", displayName: "Problem Solver" }
      ]
    },
    github: {
      profile: {
        username: "",
        realName: "",
        aboutMe: "Full stack developer passionate about open source.",
        school: "Computer Science University",
        company: "Open Source Contributor",
        jobTitle: "Senior Developer",
        countryName: "Canada",
        skillTags: ["JavaScript", "React", "Node.js"]
      },
      stats: {
        totalRepos: 45,
        stars: 325,
        followers: 128,
        following: 87,
        contributions: 1547
      },
      activity: {
        streak: 8,
        totalActiveDays: 230
      },
      repositories: [
        { name: "awesome-project", stars: 120, language: "JavaScript" },
        { name: "data-visualizer", stars: 85, language: "TypeScript" }
      ]
    },
    codeforces: {
      profile: {
        username: "",
        realName: "",
        aboutMe: "Competitive programmer and algorithm enthusiast.",
        school: "Moscow Institute of Physics and Technology",
        company: "",
        jobTitle: "Student",
        countryName: "Russia",
        skillTags: ["Algorithms", "C++", "Math"]
      },
      stats: {
        rating: 1845,
        maxRating: 1925,
        rank: "Candidate Master",
        contribution: 28
      },
      activity: {
        totalContests: 42
      },
      contests: [
        { contestName: "Codeforces Round #675", rank: 342, ratingChange: 20 },
        { contestName: "Codeforces Round #674", rank: 567, ratingChange: -25 }
      ]
    },
    hackerrank: {
      profile: {
        username: "",
        realName: "",
        aboutMe: "Learning and solving problems one day at a time.",
        school: "Engineering College",
        company: "Tech Startup",
        jobTitle: "Backend Developer",
        countryName: "India",
        skillTags: ["Problem Solving", "Java", "Python"]
      },
      stats: {
        overallRank: 12543,
        totalScore: 3245,
        stars: 5,
        badges: 12
      },
      activity: {
        streak: 7,
        totalSolved: 245
      },
      badges: [
        { name: "Problem Solving", displayName: "5★ Problem Solving" },
        { name: "Java", displayName: "4★ Java" }
      ]
    }
  };

  // Generate activity data
  const generateActivityData = () => {
    const today = new Date();
    return Array.from({length: 30}, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - 29 + i);
      const formattedDate = `${date.getMonth()+1}/${date.getDate()}`;
      return {
        date: formattedDate,
        value: Math.floor(Math.random() * 10)
      };
    });
  };

  const fetchProfile = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty!");
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Use mock data
      const data = _.cloneDeep(mockData[platform]);
      data.profile.username = username;
      data.profile.realName = username;
      data.activityData = generateActivityData();
      
      setProfile(data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch ${platforms[platform].name} profile. Please try again.`);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchProfile();
    }
  };

  // Render stats based on platform
  const renderStats = () => {
    if (!profile) return null;
    
    const stats = profile.stats;
    let statItems = [];
    
    if (platform === "leetcode") {
      statItems = [
        { label: "Problems Solved", value: stats.totalSolved },
        { label: "Easy", value: stats.easySolved },
        { label: "Medium", value: stats.mediumSolved },
        { label: "Hard", value: stats.hardSolved },
        { label: "Acceptance Rate", value: `${stats.acceptanceRate}%` },
        { label: "Ranking", value: `#${stats.ranking}` }
      ];
    } else if (platform === "github") {
      statItems = [
        { label: "Repositories", value: stats.totalRepos },
        { label: "Stars", value: stats.stars },
        { label: "Followers", value: stats.followers },
        { label: "Following", value: stats.following },
        { label: "Contributions", value: stats.contributions }
      ];
    } else if (platform === "codeforces") {
      statItems = [
        { label: "Rating", value: stats.rating },
        { label: "Max Rating", value: stats.maxRating },
        { label: "Rank", value: stats.rank },
        { label: "Contribution", value: stats.contribution }
      ];
    } else if (platform === "hackerrank") {
      statItems = [
        { label: "Overall Rank", value: `#${stats.overallRank}` },
        { label: "Total Score", value: stats.totalScore },
        { label: "Stars", value: `${stats.stars}★` },
        { label: "Badges", value: stats.badges }
      ];
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-400">{item.label}</p>
            <p className="text-xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-${platforms[platform].color}-500 to-${platforms[platform].color}-600 mb-2`}>
            Coding Profile Tracker
          </h1>
          <p className="text-gray-400">Track your progress across major coding platforms</p>
        </div>
        
        {/* Platform Selector */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm bg-gray-800 p-1">
            {Object.keys(platforms).map((key) => (
              <button
                key={key}
                onClick={() => setPlatform(key)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  platform === key 
                    ? `bg-gray-700 text-${platforms[key].color}-400` 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="mr-2">
                  {platforms[key].icon()}
                </span>
                {platforms[key].name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Search Box */}
        <div className="mb-8">
          <div className={`bg-gray-800 p-1 rounded-lg border-2 flex items-center overflow-hidden border-gray-700`}>
            <input
              type="text"
              placeholder={`Enter ${platforms[platform].name} username`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow px-4 py-3 bg-transparent outline-none text-lg"
            />
            <button
              onClick={fetchProfile}
              disabled={!username || loading}
              className={`px-6 py-3 rounded-md font-bold transition-all ${
                !username || loading 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : `bg-${platforms[platform].color}-600 text-white hover:opacity-90`
              }`}
            >
              {loading ? "Loading..." : "Fetch Profile"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Profile Display */}
        {profile && !loading && (
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
            {/* Profile Header */}
            <div className={`bg-${platforms[platform].color}-900/30 p-6`}>
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-full bg-${platforms[platform].color}-600 flex items-center justify-center text-xl font-bold`}>
                  {profile.profile.username.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-grow">
                  <h2 className="text-xl font-bold flex items-center">
                    {profile.profile.username}
                    <span className="ml-2">
                      {platforms[platform].icon()}
                    </span>
                  </h2>
                  <div className="text-sm text-gray-400">
                    {profile.profile.jobTitle} {profile.profile.company ? `at ${profile.profile.company}` : ""}
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mt-6 border-t border-gray-700 pt-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-2 rounded-md text-sm transition-all ${
                    activeTab === 'profile'
                      ? `bg-${platforms[platform].color}-600 text-white`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-4 py-2 rounded-md text-sm transition-all ${
                    activeTab === 'stats'
                      ? `bg-${platforms[platform].color}-600 text-white`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Stats
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-4 py-2 rounded-md text-sm transition-all ${
                    activeTab === 'activity'
                      ? `bg-${platforms[platform].color}-600 text-white`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Activity
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <p className="text-gray-300 mb-6">{profile.profile.aboutMe}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.profile.school && (
                      <div>
                        <h4 className="text-sm text-gray-400 mb-1">Education</h4>
                        <p className="text-gray-200">{profile.profile.school}</p>
                      </div>
                    )}
                    
                    {profile.profile.countryName && (
                      <div>
                        <h4 className="text-sm text-gray-400 mb-1">Country</h4>
                        <p className="text-gray-200">{profile.profile.countryName}</p>
                      </div>
                    )}
                  </div>
                  
                  {profile.profile.skillTags && profile.profile.skillTags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm text-gray-400 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.profile.skillTags.map((tag, index) => (
                          <span key={index} className={`bg-${platforms[platform].color}-900/30 text-${platforms[platform].color}-300 text-xs px-3 py-1 rounded-full`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Statistics</h3>
                  {renderStats()}
                </div>
              )}
              
              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Activity</h3>
                  
                  <div className="bg-gray-900 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-gray-400 text-sm">Current Streak</span>
                        <div className="text-xl font-bold">{profile.activity.streak || 0} days</div>
                      </div>
                      {profile.activity.totalActiveDays && (
                        <div>
                          <span className="text-gray-400 text-sm">Total Active Days</span>
                          <div className="text-xl font-bold">{profile.activity.totalActiveDays} days</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={profile.activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                          labelStyle={{ color: '#E5E7EB' }}
                        />
                        <Bar dataKey="value" name="Activity" fill={`#${platforms[platform].color === 'yellow' ? 'FBBF24' : 
                            platforms[platform].color === 'purple' ? '8B5CF6' : 
                            platforms[platform].color === 'red' ? 'EF4444' : '10B981'}`} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}