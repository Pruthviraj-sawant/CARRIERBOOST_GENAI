import { useState,useEffect, use } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

export default function CodeforceProfileTracker() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [contestsData, setContestsData] = useState(null);
  const [submissionsData, setSubmissionsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

useEffect(() => {
  const savedUsername = localStorage.getItem('codeforcesUsername');
  if (savedUsername) {
    setUsername(savedUsername);
  }
}, []);

useEffect(() => {
  const delayDebounce=setTimeout(() => {
    localStorage.setItem('codeforcesUsername', username); 
    fetchProfile();
  }, 600); // 1 second delay
  return () => clearTimeout(delayDebounce);}// Cleanup the timeout on unmount or when username changes  
  ,[username]);// Add username as a dependency to the effect 



  const fetchProfile = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty!");
      return;
    }
    setLoading(true);
    setError("");
    setProfile(null);
    setContestsData(null);
    setSubmissionsData(null);
  
    try {
      // Fetch user info
      const userInfoResponse = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
      const userInfoData = await userInfoResponse.json();
      
      if (userInfoData.status !== "OK") {
        setError("User not found or API error!");
        setLoading(false);
        return;
      }
      
      setProfile(userInfoData.result[0]);
      
      // Fetch recent contests
      const contestsResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
      const contestsData = await contestsResponse.json();
      
      if (contestsData.status === "OK") {
        // Get the most recent 30 contests or all if less than 30
        const recentContests = contestsData.result.slice(-30);
        
        // Format data for the chart
        const formattedContests = recentContests.map(contest => ({
          name: contest.contestName.substring(0, 10) + "...",
          rating: contest.newRating,
          rank: contest.rank,
          date: new Date(contest.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
        }));
        
        setContestsData({
          contests: formattedContests,
          totalContests: contestsData.result.length,
          maxRating: Math.max(...contestsData.result.map(c => c.newRating), 0),
          minRating: Math.min(...contestsData.result.map(c => c.newRating), 0),
          currentRating: contestsData.result.length > 0 ? contestsData.result[contestsData.result.length - 1].newRating : 0
        });
      }
      
      // Fetch recent submissions
      const submissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${username}&count=100`);
      const submissionsData = await submissionsResponse.json();
      
      if (submissionsData.status === "OK") {
        // Group submissions by day for the last 30 days
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentSubmissions = submissionsData.result.filter(submission => 
          submission.creationTimeSeconds * 1000 >= thirtyDaysAgo
        );
        
        // Format by day
        const submissionsByDay = {};
        recentSubmissions.forEach(submission => {
          const date = new Date(submission.creationTimeSeconds * 1000);
          const dateKey = `${date.getMonth()+1}/${date.getDate()}`;
          
          if (!submissionsByDay[dateKey]) {
            submissionsByDay[dateKey] = 0;
          }
          submissionsByDay[dateKey]++;
        });
        
        // Create array for last 30 days
        const last30Days = Array.from({length: 30}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 29 + i);
          const dateKey = `${date.getMonth()+1}/${date.getDate()}`;
          return {
            date: dateKey,
            submissions: submissionsByDay[dateKey] || 0
          };
        });
        
        // Calculate AC (Accepted) rate
        const accepted = submissionsData.result.filter(s => s.verdict === "OK").length;
        const totalSubmissions = submissionsData.result.length;
        const acceptanceRate = totalSubmissions > 0 ? (accepted / totalSubmissions * 100).toFixed(1) : 0;
        
        // Group by problem tags
        const problemTags = {};
        submissionsData.result
          .filter(s => s.verdict === "OK" && s.problem && s.problem.tags)
          .forEach(submission => {
            submission.problem.tags.forEach(tag => {
              if (!problemTags[tag]) {
                problemTags[tag] = 0;
              }
              problemTags[tag]++;
            });
          });
        
        // Sort tags by count
        const sortedTags = Object.entries(problemTags)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);
        
        setSubmissionsData({
          activityByDay: last30Days,
          totalSubmissions: totalSubmissions,
          acceptedSubmissions: accepted,
          acceptanceRate: acceptanceRate,
          topTags: sortedTags
        });
      }
      
    } catch (err) {
      console.error(err);
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
  
  // Get appropriate title based on rating
  const getRatingTitle = (rating) => {
    if (!rating) return "Unrated";
    if (rating < 1200) return "Newbie";
    if (rating < 1400) return "Pupil";
    if (rating < 1600) return "Specialist";
    if (rating < 1900) return "Expert";
    if (rating < 2100) return "Candidate Master";
    if (rating < 2300) return "Master";
    if (rating < 2400) return "International Master";
    if (rating < 2600) return "Grandmaster";
    if (rating < 3000) return "International Grandmaster";
    return "Legendary Grandmaster";
  };
  
  // Get color class based on rating
  const getRatingColorClass = (rating) => {
    if (!rating) return "text-gray-400";
    if (rating < 1200) return "text-gray-400";
    if (rating < 1400) return "text-green-500";
    if (rating < 1600) return "text-cyan-500";
    if (rating < 1900) return "text-blue-500";
    if (rating < 2100) return "text-purple-500";
    if (rating < 2300) return "text-yellow-500";
    if (rating < 2400) return "text-yellow-600";
    if (rating < 2600) return "text-red-500";
    if (rating < 3000) return "text-red-600";
    return "text-red-700";
  };
  
  return (
    <div className="min-h-screen text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-600 mb-2">
            Codeforces Profile Tracker
          </h1>
          <p className="text-gray-400">Discover the skills and achievements of competitive programmers</p>
        </div>
        
        {/* Search Box */}
        {/* <div className={`relative transition-all duration-300 mb-8 ${searchFocus ? 'scale-105' : ''}`}>
          <div className={`bg-gray-800 p-1 rounded-lg border-2 flex items-center overflow-hidden ${searchFocus ? 'border-red-500 shadow-lg' : 'border-gray-700'}`}>
            <input
              type="text"
              placeholder="Enter Codeforces username"
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
                  : 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:from-red-700 hover:to-blue-700'
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
            <div className="bg-gradient-to-r from-red-900 to-blue-900 p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-red-500 shadow-lg">
                    {profile.titlePhoto ? (
                      <img
                        src={profile.titlePhoto}
                        alt={profile.handle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
                        {profile.handle.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center md:text-left flex-grow">
                  <h2 className="text-2xl font-bold flex flex-wrap justify-center md:justify-start items-center">
                    <span className={`${getRatingColorClass(profile.rating)}`}>{profile.handle}</span>
                    {profile.rank && (
                      <span className={`ml-2 text-sm px-2 py-1 rounded-full ${getRatingColorClass(profile.rating)} bg-gray-900`}>
                        {profile.rank}
                      </span>
                    )}
                  </h2>
                  {profile.firstName || profile.lastName ? (
                    <p className="text-gray-400">{`${profile.firstName || ''} ${profile.lastName || ''}`}</p>
                  ) : null}
                </div>
                
                {/* Rating Stats */}
                {contestsData && (
                  <div className="flex flex-col gap-2 items-center md:items-end mt-4 md:mt-0">
                    <div className="flex gap-2">
                      <div className="px-3 py-1 bg-red-900 rounded-lg border border-red-700 text-red-300">
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
                    ? 'text-red-400 border-b-2 border-red-500' 
                    : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Profile
                </button>
                <button 
                  onClick={() => setActiveTab('contests')}
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'contests' 
                    ? 'text-red-400 border-b-2 border-red-500' 
                    : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Contests
                  {contestsData && (
                    <span className="ml-2 bg-red-900 text-red-300 text-xs px-2 py-1 rounded-full">
                      {contestsData.totalContests}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('submissions')}
                  className={`px-4 py-3 font-medium text-sm ${activeTab === 'submissions' 
                    ? 'text-red-400 border-b-2 border-red-500' 
                    : 'text-gray-400 hover:text-gray-300'}`}
                >
                  Submissions
                  {submissionsData && (
                    <span className="ml-2 bg-red-900 text-red-300 text-xs px-2 py-1 rounded-full">
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
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Status</h3>
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
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contests Tab */}
              {activeTab === 'contests' && contestsData && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Rating History</h3>
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
                          <Line type="monotone" dataKey="rating" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}