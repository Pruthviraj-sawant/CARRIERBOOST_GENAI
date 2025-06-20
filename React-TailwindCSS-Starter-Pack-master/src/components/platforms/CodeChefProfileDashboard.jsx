import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

export default function CodechefProfileTracker() {
  const [username, setUsername] = useState("");
  const [savedUsername, setSavedUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [contestsData, setContestsData] = useState(null);
  const [submissionsData, setSubmissionsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // On component mount, check if username exists in localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("codechef-username");
    if (storedUsername) {
      setUsername(storedUsername);
      setSavedUsername(storedUsername);
      fetchProfileData(storedUsername);
    }
  }, []);

  const saveUsername = () => {
    if (!username.trim()) {
      setError("Username cannot be empty!");
      return;
    }
    
    localStorage.setItem("codechef-username", username);
    setSavedUsername(username);
    fetchProfileData(username);
  };
  
  const clearSavedUsername = () => {
    localStorage.removeItem("codechef-username");
    setSavedUsername("");
    setProfile(null);
    setContestsData(null);
    setSubmissionsData(null);
    setError("");
  };

  const fetchProfileData = async (usernameToFetch) => {
    if (!usernameToFetch.trim()) {
      setError("Username cannot be empty!");
      return;
    }
    
    setLoading(true);
    setError("");
    setProfile(null);
    setContestsData(null);
    setSubmissionsData(null);
  
    try {
      // In a real implementation, these would be API calls to your backend
      // that performs web scraping or uses unofficial APIs
      
      // Fetch profile data
      const profileData = await fetchCodechefProfile(usernameToFetch);
      if (!profileData) {
        throw new Error("Failed to fetch profile data");
      }
      setProfile(profileData);
      
      // Fetch contest history
      const contestsHistory = await fetchCodechefContestHistory(usernameToFetch);
      setContestsData(contestsHistory);
      
      // Fetch recent submissions
      const recentSubmissions = await fetchCodechefSubmissions(usernameToFetch);
      setSubmissionsData(recentSubmissions);
      
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profile. Please check if the username is correct.");
    }
    
    setLoading(false);
  };

  // ======= These functions would interact with your backend =======
  // Replace these with actual API calls to your backend server that does the scraping
  
// Replace the API functions in your frontend with these:

async function fetchCodechefProfile(username) {
  try {
    const response = await fetch(`http://localhost:5000/api/codechef/profile/${username}`);
    if (!response.ok) throw new Error("User not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

async function fetchCodechefContestHistory(username) {
  try {
    const response = await fetch(`http://localhost:5000/api/codechef/contests/${username}`);
    if (!response.ok) throw new Error("Failed to fetch contests data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching contest history:", error);
    throw error;
  }
}

async function fetchCodechefSubmissions(username) {
  try {
    const response = await fetch(`http://localhost:5000/api/codechef/submissions/${username}`);
    if (!response.ok) throw new Error("Failed to fetch submissions data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw error;
  }
}
  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveUsername();
    }
  };
  
  // Get appropriate title based on rating
  const getRatingTitle = (rating) => {
    if (!rating) return "Unrated";
    if (rating < 1400) return "1★";
    if (rating < 1600) return "2★";
    if (rating < 1800) return "3★";
    if (rating < 2000) return "4★";
    if (rating < 2200) return "5★";
    if (rating < 2500) return "6★";
    if (rating < 2700) return "7★";
    return "8★";
  };
  
  // Get color class based on rating
  const getRatingColorClass = (rating) => {
    if (!rating) return "text-gray-400";
    if (rating < 1400) return "text-gray-400";  // 1★
    if (rating < 1600) return "text-green-500"; // 2★
    if (rating < 1800) return "text-blue-500";  // 3★
    if (rating < 2000) return "text-purple-500"; // 4★
    if (rating < 2200) return "text-yellow-500"; // 5★
    if (rating < 2500) return "text-orange-500"; // 6★
    if (rating < 2700) return "text-red-500";   // 7★
    return "text-red-700"; // 8★
  };
  
  return (
    <div className="min-h-screen text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600 mb-2">
            CodeChef Profile Tracker
          </h1>
          <p className="text-gray-400">Track your CodeChef journey and competitive programming progress</p>
        </div>
        
        {/* Input Box with Save Button */}
        <div className={`relative transition-all duration-300 mb-8 ${inputFocus ? 'scale-105' : ''}`}>
          <div className={`bg-gray-800 p-1 rounded-lg border-2 flex items-center overflow-hidden ${inputFocus ? 'border-green-500 shadow-lg' : 'border-gray-700'}`}>
            <input
              type="text"
              placeholder="Enter CodeChef username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              onKeyPress={handleKeyPress}
              className="flex-grow px-4 py-3 bg-transparent outline-none text-lg"
            />
            <button
              onClick={saveUsername}
              disabled={!username || loading}
              className={`px-6 py-3 rounded-md font-bold transition-all duration-300 ${
                !username || loading 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
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
              ) : savedUsername === username ? "Refresh" : "Save"}
            </button>
          </div>
          
          {/* Current Username Indicator */}
          {savedUsername && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Currently tracking: <span className="text-green-400 font-medium">{savedUsername}</span>
              </span>
              <button 
                onClick={clearSavedUsername}
                className="text-red-400 hover:text-red-300 underline underline-offset-2"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center">
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
          </div>
        )}

        {/* Profile Display */}
        {profile && !loading && (
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-green-900 to-blue-900 p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green-500 shadow-lg">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
                        {profile.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center md:text-left flex-grow">
                  <h2 className="text-2xl font-bold flex flex-wrap justify-center md:justify-start items-center">
                    <span className={`${getRatingColorClass(profile.rating)}`}>{profile.username}</span>
                    {profile.stars && (
                      <span className={`ml-2 text-sm px-2 py-1 rounded-full ${getRatingColorClass(profile.rating)} bg-gray-900`}>
                        {profile.stars}
                      </span>
                    )}
                  </h2>
                  {profile.name && (
                    <p className="text-gray-400">{profile.name}</p>
                  )}
                  {profile.country && (
                    <p className="text-gray-400 text-sm">{profile.country}</p>
                  )}
                </div>
                
                {/* Rating Stats */}
                {profile.rating !== undefined && (
                  <div className="flex flex-col gap-2 items-center md:items-end mt-4 md:mt-0">
                    <div className="flex gap-2">
                      <div className="px-3 py-1 bg-green-900 rounded-lg border border-green-700 text-green-300">
                        <div className="flex items-center">
                          <span className={`font-bold ${getRatingColorClass(profile.rating)}`}>{profile.rating || 0}</span>
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
                    ? 'text-green-400 border-b-2 border-green-500' 
                    : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Profile
                </button>
                <button 
                  onClick={() => setActiveTab('contests')}
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'contests' 
                    ? 'text-green-400 border-b-2 border-green-500' 
                    : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Contests
                  {contestsData && contestsData.totalContests > 0 && (
                    <span className="ml-2 bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full">
                      {contestsData.totalContests}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('submissions')}
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'submissions' 
                    ? 'text-green-400 border-b-2 border-green-500' 
                    : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Submissions
                  {submissionsData && submissionsData.totalSubmissions > 0 && (
                    <span className="ml-2 bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full">
                      {submissionsData.totalSubmissions}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && profile && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Profile Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Rating</h4>
                        <div className="flex items-center">
                          <span className={`text-2xl font-bold ${getRatingColorClass(profile.rating)}`}>
                            {profile.rating || "Unrated"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{getRatingTitle(profile.rating)}</p>
                      </div>
                      
                      {profile.globalRank && (
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Global Rank</h4>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-blue-400">{profile.globalRank}</span>
                          </div>
                        </div>
                      )}
                      
                      {profile.countryRank && (
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Country Rank</h4>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-green-400">{profile.countryRank}</span>
                            <span className="ml-2 text-xs text-gray-400">{profile.country}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {profile.institution && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-300">Institution</h3>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-300">{profile.institution}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile.joinedDate && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-300">Member Since</h3>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <p className="text-gray-300">{profile.joinedDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Contests Tab */}
              {activeTab === 'contests' && contestsData && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Rating History</h3>
                    {contestsData.contests && contestsData.contests.length > 0 ? (
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={contestsData.contests}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.375rem' }}
                              itemStyle={{ color: '#F3F4F6' }}
                              labelStyle={{ color: '#D1D5DB' }}
                            />
                            <Line type="monotone" dataKey="rating" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-center">
                        <p className="text-gray-400">No contest history available</p>
                      </div>
                    )}
                  </div>
                  
                  {contestsData.totalContests > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-300">Contest Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Total Contests</h4>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-blue-400">{contestsData.totalContests}</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Highest Rating</h4>
                          <div className="flex items-center">
                            <span className={`text-2xl font-bold ${getRatingColorClass(contestsData.maxRating)}`}>
                              {contestsData.maxRating}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Current Rating</h4>
                          <div className="flex items-center">
                            <span className={`text-2xl font-bold ${getRatingColorClass(contestsData.currentRating)}`}>
                              {contestsData.currentRating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Submissions Tab */}
              {activeTab === 'submissions' && submissionsData && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Submission Stats</h3>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-gray-800 p-3 rounded-lg flex-1">
                          <p className="text-sm text-gray-400">Total Submissions</p>
                          <p className="text-2xl font-bold text-blue-400">{submissionsData.totalSubmissions}</p>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg flex-1">
                          <p className="text-sm text-gray-400">Accepted</p>
                          <p className="text-2xl font-bold text-green-400">{submissionsData.acceptedSubmissions}</p>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg flex-1">
                          <p className="text-sm text-gray-400">Acceptance Rate</p>
                          <p className="text-2xl font-bold text-yellow-400">{submissionsData.acceptanceRate}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {submissionsData.activityByDay && submissionsData.activityByDay.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-300">Activity (Last 30 Days)</h3>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={submissionsData.activityByDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.375rem' }}
                              itemStyle={{ color: '#F3F4F6' }}
                              labelStyle={{ color: '#D1D5DB' }}
                            />
                            <Line type="monotone" dataKey="submissions" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  
                  {submissionsData.topTags && submissionsData.topTags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-300">Top Problem Tags</h3>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {submissionsData.topTags.map((tag, index) => (
                            <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-800 rounded">
                              <span className="text-gray-300">{tag[0]}</span>
                              <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full">
                                {tag[1]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Info message when no data is available */}
        {!profile && !loading && !error && (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-bold text-gray-200 mb-2">No Profile Data</h3>
            <p className="text-gray-400 mb-4">Enter a CodeChef username and save it to view profile data.</p>
          </div>
        )}
        
        {/* Footer */}
      
      </div>
    </div>
  );
}