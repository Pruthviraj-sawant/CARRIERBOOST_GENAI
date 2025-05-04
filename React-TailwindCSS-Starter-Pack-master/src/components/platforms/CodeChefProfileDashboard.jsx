import { useState, useEffect } from "react";
import { User, Code, Trophy, Medal, Calendar, Award, Activity, BarChart2 } from "lucide-react";

function CodeChefProfileDashboard() {
  const [username, setUsername] = useState("");
  const [savedUsername, setSavedUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputFocus, setInputFocus] = useState(false);

  const saveUsername = () => {
    if (!username.trim()) {
      setError("Username cannot be empty!");
      return;
    }
    
    setSavedUsername(username);
    fetchProfile(username);
  };

  const fetchProfile = async (user) => {
    setLoading(true);
    setError("");
    setProfile(null);
    setSubmissions([]);
    setContests([]);
    
    try {
      // In a real implementation, you would fetch from the actual CodeChef API
      // Here we simulate the API call with a timeout and mock data
      setTimeout(() => {
        const mockProfile = generateMockProfile(user);
        const mockSubmissions = generateMockSubmissions();
        const mockContests = generateMockContests();
        
        setProfile(mockProfile);
        setSubmissions(mockSubmissions);
        setContests(mockContests);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to fetch profile data");
      setLoading(false);
    }
  };

  // Function to generate mock profile data
  const generateMockProfile = (user) => {
    const stars = Math.floor(Math.random() * 7) + 1; // 1-7 stars
    return {
      username: user,
      fullname: `${user.charAt(0).toUpperCase() + user.slice(1)} Smith`,
      stars: stars,
      rating: Math.floor(Math.random() * 2000) + 1000,
      globalRank: Math.floor(Math.random() * 10000) + 1,
      countryRank: Math.floor(Math.random() * 1000) + 1,
      country: "United States",
      institution: "University of Technology",
      registered: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toDateString(),
      problemsSolved: Math.floor(Math.random() * 500) + 50,
      contestsParticipated: Math.floor(Math.random() * 50) + 5
    };
  };

  // Function to generate mock submissions
  const generateMockSubmissions = () => {
    const problemCodes = ["FLOW001", "START01", "INTEST", "ZCO14003", "CARVANS", "FCTRL", "FLOW007"];
    const verdicts = ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error"];
    const languages = ["C++", "Python", "Java", "C", "Go"];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      problemCode: problemCodes[Math.floor(Math.random() * problemCodes.length)],
      problemName: `Problem ${i + 1}`,
      verdict: verdicts[Math.floor(Math.random() * verdicts.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      time: (Math.random() * 2).toFixed(2),
      memory: (Math.random() * 50).toFixed(1),
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toLocaleString()
    }));
  };

  // Function to generate mock contests
  const generateMockContests = () => {
    const contestTypes = ["Long Challenge", "Cook-Off", "Lunch Time", "Starters"];
    
    return Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `${contestTypes[Math.floor(Math.random() * contestTypes.length)]} ${Math.floor(Math.random() * 100)}`,
      rank: Math.floor(Math.random() * 1000) + 1,
      oldRating: Math.floor(Math.random() * 2000) + 1000,
      newRating: Math.floor(Math.random() * 2000) + 1000,
      ratingChange: Math.floor(Math.random() * 100) - 50,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toLocaleDateString()
    }));
  };

  // Function to generate heatmap data
  const generateHeatmapData = () => {
    const today = new Date();
    const monthsData = [];
    
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(today);
      monthDate.setMonth(today.getMonth() - i);
      
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      const days = Array.from({ length: daysInMonth }, (_, dayIndex) => {
        const dayCount = Math.floor(Math.random() * 5);
        return dayCount > 0 ? dayCount : 0;
      });
      
      monthsData.unshift({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        year: monthDate.getFullYear(),
        days: days
      });
    }
    
    return monthsData;
  };

  // Get color based on activity intensity
  const getActivityColor = (count) => {
    if (count === 0) return "bg-gray-800";
    if (count === 1) return "bg-orange-900";
    if (count === 2) return "bg-orange-700";
    if (count === 3) return "bg-orange-500";
    return "bg-orange-400";
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveUsername();
    }
  };
  
  return (
    <div className="min-h-screen bg-white text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-600 mb-2">
            CodeChef Profile Dashboard
          </h1>
          <p className="text-gray-400">Track your CodeChef stats and submissions</p>
        </div>
        
        {/* Username Input */}
        <div className={`relative mb-8 ${inputFocus ? 'scale-105' : ''} transition-all duration-300`}>
          <div className={`bg-gray-800 p-1 rounded-lg border-2 flex items-center overflow-hidden ${inputFocus ? 'border-orange-500 shadow-lg shadow-orange-500/30' : 'border-gray-700'}`}>
            <input
              type="text"
              placeholder="Enter your CodeChef username"
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
                  : 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white hover:from-orange-700 hover:to-yellow-700'
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
              ) : "Save"}
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

        {/* Loading Skeleton */}
        {loading && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl animate-pulse">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-gray-700 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-20 bg-gray-700 rounded w-full"></div>
              <div className="h-20 bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        )}

        {/* Profile Display */}
        {profile && !loading && (
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 p-6 border-b border-gray-700">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  <img
                    src="/api/placeholder/120/120"
                    alt={profile.username}
                    className="w-24 h-24 rounded-full border-2 border-orange-500 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-gray-800">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="text-center sm:text-left flex-grow">
                  <h2 className="text-2xl font-bold">{profile.fullname}</h2>
                  <div className="flex items-center justify-center sm:justify-start">
                    <span className="text-gray-300">@{profile.username}</span>
                    <span className="ml-3 text-yellow-500 flex items-center">
                      {Array.from({ length: profile.stars }, (_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
                    <span className="inline-flex items-center text-sm text-gray-400">
                      <Trophy className="w-4 h-4 mr-1" />
                      Rating: {profile.rating}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-400">
                      <BarChart2 className="w-4 h-4 mr-1" />
                      Global Rank: {profile.globalRank}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-400">
                      <Award className="w-4 h-4 mr-1" />
                      {profile.country} Rank: {profile.countryRank}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2">
                    <span className="inline-flex items-center text-sm text-gray-400">
                      <User className="w-4 h-4 mr-1" />
                      {profile.institution}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined: {profile.registered}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Activity Heatmap */}
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Submission Activity
              </h3>
              
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  {/* Heatmap visualization */}
                  <div className="flex flex-col space-y-2">
                    {generateHeatmapData().map((monthData, monthIndex) => (
                      <div key={monthIndex} className="flex items-center">
                        <div className="w-16 text-xs text-gray-500">{`${monthData.month} ${monthData.year}`}</div>
                        <div className="flex">
                          {monthData.days.map((count, dayIndex) => (
                            <div
                              key={dayIndex}
                              className={`w-3 h-3 m-px rounded-sm ${getActivityColor(count)}`}
                              title={`${count} submissions on ${monthData.month} ${dayIndex + 1}, ${monthData.year}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center mt-4 justify-end">
                    <div className="text-xs text-gray-500 mr-2">Less</div>
                    <div className="w-3 h-3 rounded-sm bg-gray-800 mr-1"></div>
                    <div className="w-3 h-3 rounded-sm bg-orange-900 mr-1"></div>
                    <div className="w-3 h-3 rounded-sm bg-orange-700 mr-1"></div>
                    <div className="w-3 h-3 rounded-sm bg-orange-500 mr-1"></div>
                    <div className="w-3 h-3 rounded-sm bg-orange-400 mr-1"></div>
                    <div className="text-xs text-gray-500 ml-1">More</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="p-4 border-b border-gray-700 bg-gray-800/50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-center mb-1">
                    <Code className="w-4 h-4 text-orange-400 mr-1" />
                    <span className="text-xs font-medium text-gray-400">Problems Solved</span>
                  </div>
                  <span className="text-xl font-bold">{profile.problemsSolved}</span>
                </div>
                
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-center mb-1">
                    <Trophy className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-xs font-medium text-gray-400">Contests</span>
                  </div>
                  <span className="text-xl font-bold">{profile.contestsParticipated}</span>
                </div>
                
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-center mb-1">
                    <Medal className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-xs font-medium text-gray-400">Stars</span>
                  </div>
                  <span className="text-xl font-bold">{profile.stars}</span>
                </div>
                
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-center mb-1">
                    <BarChart2 className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-xs font-medium text-gray-400">Rating</span>
                  </div>
                  <span className="text-xl font-bold">{profile.rating}</span>
                </div>
              </div>
            </div>
            
            {/* Recent Submissions */}
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Recent Submissions
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="pb-2 font-medium">Problem</th>
                      <th className="pb-2 font-medium">Result</th>
                      <th className="pb-2 font-medium">Language</th>
                      <th className="pb-2 font-medium">Time</th>
                      <th className="pb-2 font-medium">Memory</th>
                      <th className="pb-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="border-t border-gray-700">
                        <td className="py-3 pr-4">
                          <span className="text-blue-400">{submission.problemCode}</span>
                          <span className="ml-2 text-gray-400">{submission.problemName}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            submission.verdict === 'Accepted' ? 'bg-green-900/50 text-green-400' : 
                            'bg-red-900/50 text-red-400'
                          }`}>
                            {submission.verdict}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-400">{submission.language}</td>
                        <td className="py-3 pr-4 text-gray-400">{submission.time} s</td>
                        <td className="py-3 pr-4 text-gray-400">{submission.memory} MB</td>
                        <td className="py-3 text-gray-400">{submission.submittedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Recent Contests */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Recent Contests
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="pb-2 font-medium">Contest</th>
                      <th className="pb-2 font-medium">Rank</th>
                      <th className="pb-2 font-medium">Old Rating</th>
                      <th className="pb-2 font-medium">New Rating</th>
                      <th className="pb-2 font-medium">Change</th>
                      <th className="pb-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contests.map((contest) => (
                      <tr key={contest.id} className="border-t border-gray-700">
                        <td className="py-3 pr-4">
                          <span className="text-blue-400">{contest.name}</span>
                        </td>
                        <td className="py-3 pr-4 text-gray-300">{contest.rank}</td>
                        <td className="py-3 pr-4 text-gray-300">{contest.oldRating}</td>
                        <td className="py-3 pr-4 text-gray-300">{contest.newRating}</td>
                        <td className="py-3 pr-4">
                          <span className={`${
                            contest.ratingChange > 0 ? 'text-green-400' : 
                            contest.ratingChange < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400">{contest.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default CodeChefProfileDashboard;