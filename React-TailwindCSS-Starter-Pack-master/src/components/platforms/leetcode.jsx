
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function BadassLeetCodeProfileFetcher() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [badges, setBadges] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');




  // Load saved username from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem("leetcodeUsername");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Debounced search when username changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (username.trim()) {
        localStorage.setItem("leetcodeUsername", username); // Save to localStorage
        fetchProfile();
      }
    }, 600); // debounce time

    return () => clearTimeout(delayDebounce);
  }, [username]);

  // Example fetch function
  
   
  

  const fetchProfile = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty!");
      return;
    }
    setLoading(true);
    setError("");
    setProfile(null);
    setActivityData(null);
    setBadges(null);
  
    try {
      // Fetch basic profile
      const profileResponse = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Referer": `https://leetcode.com/${username}/`,
        },
        body: JSON.stringify({
          operationName: "getUserProfile",
          variables: { username },
          query: `
           query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      realName
      aboutMe
      school
      websites
      countryName
      company 
      jobTitle
      skillTags
      userAvatar
    }
  }
}
          `,
        }),
      });
  
      const profileData = await profileResponse.json();
      
      if (!profileData.data || !profileData.data.matchedUser) {
        setError("User not found!");
        setLoading(false);
        return;
      }
      
      setProfile(profileData.data.matchedUser);
      
      // Fetch activity data
      const activityResponse = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Referer": `https://leetcode.com/${username}/`,
        },
        body: JSON.stringify({
          operationName: "getUserProfileCalendar",
          variables: { username },
          query: `
            query getUserProfileCalendar($username: String!) {
              matchedUser(username: $username) {
                userCalendar {
                  activeYears
                  streak
                  totalActiveDays
                  submissionCalendar
                }
              }
            }
          `,
        }),
      });
      
      const activityResult = await activityResponse.json();
      
      if (activityResult.data && activityResult.data.matchedUser && 
          activityResult.data.matchedUser.userCalendar) {
        // Process calendar data for chart
        const calendarData = activityResult.data.matchedUser.userCalendar;
        
        // Parse submission calendar (it's stored as a JSON string)
        const submissionCalendar = JSON.parse(calendarData.submissionCalendar || "{}");
        
        // Convert to array format for the chart
        // Only get the last 30 days for better visualization
        const today = Math.floor(Date.now() / 1000 / 86400);
        const last30Days = Array.from({length: 30}, (_, i) => {
          const day = today - 29 + i;
          const date = new Date(day * 86400 * 1000);
          const formattedDate = `${date.getMonth()+1}/${date.getDate()}`;
          return {
            date: formattedDate,
            submissions: submissionCalendar[day] || 0
          };
        });
        
        setActivityData({
          calendar: last30Days,
          streak: calendarData.streak,
          totalActiveDays: calendarData.totalActiveDays
        });
      }
      
      // Fetch badges
      const badgesResponse = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Referer": `https://leetcode.com/${username}/`,
        },
        body: JSON.stringify({
          operationName: "getUserBadges",
          variables: { username },
          query: `
            query getUserBadges($username: String!) {
              matchedUser(username: $username) {
                badges {
                  id
                  name
                  shortName
                  displayName
                  icon
                  hoverText
                  medal {
                    slug
                    config {
                      icon
                      iconGif
                      iconGifBackground
                    }
                  }
                }
              }
            }
          `,
        }),
      });
      
      const badgesResult = await badgesResponse.json();
      
      if (badgesResult.data && badgesResult.data.matchedUser) {
        setBadges(badgesResult.data.matchedUser.badges || []);
      }
      
    } catch (err) {
      setError("Failed to fetch profile. Please try again.");
    }
    setLoading(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchProfile();
    }
  };
  
  return (
    <div className="min-h-screen  text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 mb-2">
            LeetCode Profile Tracker
          </h1>
          <p className="text-gray-400">Discover the skills and achievements of LeetCode warriors</p>
        </div>
        
        {/* Search Box */}
        {/* <div className={`relative transition-all duration-300 mb-8 ${searchFocus ? 'scale-105' : ''}`}>
          <div className={`bg-gray-800 p-1 rounded-lg border-2 flex items-center overflow-hidden ${searchFocus ? 'border-indigo-500 shadow-lg shadow-indigo-500/30' : 'border-gray-700'}`}>
            <input
              type="text"
              placeholder="Enter LeetCode username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              onKeyPress={handleKeyPress}
              className="flex-grow px-4 py-3 bg-transparent outline-none text-lg"
            />
            <button
              onClick={fetchProfile}
              disabled={!username || loading}
              className={`px-6 py-3 rounded-md font-bold transition-all duration-300 ${
                !username || loading 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading
                </span>
              ) : "Hack"}
            </button>
          </div>
        </div> */}
<div className={`relative transition-all duration-300 mb-8 ${searchFocus ? 'scale-105' : ''}`}>
      <div className={`bg-gray-800 p-1 rounded-lg border-2 flex items-center overflow-hidden ${searchFocus ? 'border-indigo-500 shadow-lg shadow-indigo-500/30' : 'border-gray-700'}`}>
        <input
          type="text"
          placeholder="Enter LeetCode username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          onKeyPress={handleKeyPress}
          className="flex-grow px-4 py-3 bg-transparent outline-none text-lg text-white"
        />
            <button
              onClick={fetchProfile}
              disabled={!username || loading}
              className={`px-6 py-3 rounded-md font-bold transition-all duration-300 ${
                !username || loading 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
              }`}
            >
        {loading ? (
          <div className="px-4">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        ):"save"}
        </button>
      </div>
    </div>
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Skeleton Loader */}
        {loading && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl animate-pulse">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-gray-700 rounded-full mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 bg-gray-700 rounded-full w-16"></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Display */}
        {profile && !loading && (
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/20">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 shadow-lg shadow-indigo-500/30">
                    {profile.profile.userAvatar ? (
                      <img
                        src={profile.profile.userAvatar}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold">
                        {profile.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gray-800 rounded-full p-1 border border-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                <div className="text-center md:text-left flex-grow">
                  <h2 className="text-2xl font-bold">{profile.username}</h2>
                  {profile.profile.realName && (
                    <p className="text-gray-400">{profile.profile.realName}</p>
                  )}
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                    {profile.profile.jobTitle && (
                      <span className="inline-flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        {profile.profile.jobTitle}
                      </span>
                    )}
                    {profile.profile.company && (
                      <span className="inline-flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        {profile.profile.company}
                      </span>
                    )}
                    {profile.profile.countryName && (
                      <span className="inline-flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {profile.profile.countryName}
                      </span>
                    )}
                    {profile.profile.school && (
                      <span className="inline-flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                        {profile.profile.school}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Activity Stats Pills */}
                {activityData && (
                  <div className="flex flex-col gap-2 items-center md:items-end mt-4 md:mt-0">
                    <div className="flex gap-2">
                      <div className="px-3 py-1 bg-purple-900/40 rounded-lg border border-purple-700/30 text-purple-300">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span className="font-bold">{activityData.totalActiveDays} days</span>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-indigo-900/40 rounded-lg border border-indigo-700/30 text-indigo-300">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                          <span className="font-bold">{activityData.streak} streak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tabs Navigation */}
            <div className="border-b border-gray-700">
              <div className="flex overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'profile' 
                    ? 'text-indigo-400 border-b-2 border-indigo-500' 
                    : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Profile
                </button>
                <button 
                  onClick={() => setActiveTab('activity')}
                  className={`px-4 py-3 font-medium text-sm flex items-center ${activeTab === 'activity' 
                    ? 'text-indigo-400 border-b-2 border-indigo-500' 
                    : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Activity
                  {activityData && (
                    <span className="ml-2 bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full">
                      {activityData.totalActiveDays}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('badges')}
                  className={`px-4 py-3 font-medium text-sm flex items-center ${activeTab === 'badges' 
                    ? 'text-indigo-400 border-b-2 border-indigo-500' 
                    : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Badges
                  {badges && badges.length > 0 && (
                    <span className="ml-2 bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full">
                      {badges.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  {/* About Me Section */}
                  {profile.profile.aboutMe && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-300">About</h3>
                      <p className="text-gray-400 whitespace-pre-line">{profile.profile.aboutMe}</p>
                    </div>
                  )}
                  
                  {/* Skills Section */}
                  {profile.profile.skillTags && profile.profile.skillTags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-300">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.profile.skillTags.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-indigo-900/30 rounded-full text-indigo-300 text-sm border border-indigo-700/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Websites Section */}
                  {profile.profile.websites && profile.profile.websites.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-300">Links</h3>
                      <div className="flex flex-wrap gap-3">
                        {profile.profile.websites.map((website, index) => (
                          <a
                            href={website.startsWith('http') ? website : `https://${website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                            {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Activity Tab */}
              {activeTab === 'activity' && activityData && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Submission Activity (Last 30 Days)</h3>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={activityData.calendar}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#9CA3AF" 
                            fontSize={10}
                            tickMargin={5}
                            tickFormatter={(value, index) => index % 5 === 0 ? value : ''}
                          />
                          <YAxis stroke="#9CA3AF" fontSize={10} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', borderRadius: '0.25rem' }}
                            itemStyle={{ color: '#E5E7EB' }}
                            labelStyle={{ color: '#9CA3AF', fontWeight: 'bold', marginBottom: '0.25rem' }}
                            formatter={(value) => [`${value} submissions`, null]}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="submissions" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#8884d8', stroke: '#8884d8' }}
                            activeDot={{ r: 5, fill: '#a78bfa', stroke: '#8884d8' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Current Streak</h4>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-2xl font-bold text-gray-100">{activityData.streak} days</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Total Active Days</h4>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-2xl font-bold text-gray-100">{activityData.totalActiveDays} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Badges Tab */}
              {activeTab === 'badges' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-300">Earned Badges</h3>
                  
                  {(!badges || badges.length === 0) ? (
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 text-center">
                      <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m-8-4v10l8 4 8-4V7z"></path>
                      </svg>
                      <p className="text-gray-400">No badges earned yet. Keep solving problems to earn badges!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {badges.map(badge => (
                        <div 
                          key={badge.id} 
                          className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center hover:bg-gray-800/50 transition-all"
                        >
                          {badge.icon ? (
                            <img 
                              src={badge.icon} 
                              alt={badge.displayName} 
                              className="w-12 h-12 mr-3"
                            />
                          ) : (
                            <div className="w-12 h-12 mr-3 bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-300 border border-indigo-700/30">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                              </svg>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-200">{badge.displayName || badge.name}</h4>
                            <p className="text-xs text-gray-400">{badge.hoverText || "LeetCode Achievement"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BadassLeetCodeProfileFetcher;