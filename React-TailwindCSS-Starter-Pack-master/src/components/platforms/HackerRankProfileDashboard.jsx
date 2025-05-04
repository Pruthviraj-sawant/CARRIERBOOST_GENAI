import { useState, useEffect } from "react";
import { User, Code, Trophy, Medal, Calendar, Award, Activity, BarChart2, Star, Hash } from "lucide-react";

function HackerRankProfileDashboard() {
  const [username, setUsername] = useState("");
  const [savedUsername, setSavedUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [badges, setBadges] = useState([]);
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
    setBadges([]);
    
    try {
      // In a real implementation, you would fetch from the actual HackerRank API
      // Here we simulate the API call with a timeout and mock data
      setTimeout(() => {
        const mockProfile = generateMockProfile(user);
        const mockSubmissions = generateMockSubmissions();
        const mockBadges = generateMockBadges();
        
        setProfile(mockProfile);
        setSubmissions(mockSubmissions);
        setBadges(mockBadges);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to fetch profile data");
      setLoading(false);
    }
  };

  // Function to generate mock profile data
  const generateMockProfile = (user) => {
    return {
      username: user,
      name: `${user.charAt(0).toUpperCase() + user.slice(1)} Johnson`,
      country: "Canada",
      school: "Tech University",
      company: "Innovate Solutions",
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toDateString(),
      score: Math.floor(Math.random() * 10000),
      rank: Math.floor(Math.random() * 50000) + 1,
      skills: ["Problem Solving", "Algorithms", "Data Structures", "Mathematics", "Artificial Intelligence"],
      verified: Math.random() > 0.5,
      badges: Math.floor(Math.random() * 20) + 5,
      certifications: Math.floor(Math.random() * 5),
      problemsSolved: Math.floor(Math.random() * 500) + 100,
      contestsParticipated: Math.floor(Math.random() * 30) + 5
    };
  };

  // Function to generate mock submissions
  const generateMockSubmissions = () => {
    const domains = ["Algorithms", "Data Structures", "Mathematics", "Artificial Intelligence", "Functional Programming"];
    const subdomains = ["Warmup", "Implementation", "Strings", "Sorting", "Search", "Graph Theory", "Greedy", "Dynamic Programming"];
    const difficulties = ["Easy", "Medium", "Hard", "Advanced", "Expert"];
    const languages = ["Python", "Java", "C++", "JavaScript", "Ruby"];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      challenge: `Challenge ${i + 1}`,
      domain: domains[Math.floor(Math.random() * domains.length)],
      subdomain: subdomains[Math.floor(Math.random() * subdomains.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      score: Math.floor(Math.random() * 100) + 10,
      maxScore: 100,
      language: languages[Math.floor(Math.random() * languages.length)],
      status: Math.random() > 0.2 ? "Solved" : "Partially Solved",
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toLocaleString()
    }));
  };

  // Function to generate mock badges
  const generateMockBadges = () => {
    const badgeTypes = [
      { name: "Problem Solving", icon: "Code" },
      { name: "Python", icon: "Terminal" },
      { name: "Java", icon: "Coffee" },
      { name: "30 Days of Code", icon: "Calendar" },
      { name: "10 Days of Statistics", icon: "BarChart2" },
      { name: "Data Structures", icon: "Database" },
      { name: "Algorithms", icon: "Code" },
      { name: "Mathematics", icon: "Plus" },
      { name: "Artificial Intelligence", icon: "Cpu" },
      { name: "Functional Programming", icon: "Function" }
    ];
    
    const levels = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
    const colors = {
      Bronze: "text-orange-400",
      Silver: "text-gray-300",
      Gold: "text-yellow-500",
      Platinum: "text-blue-300",
      Diamond: "text-purple-400"
    };
    
    return Array.from({ length: Math.floor(Math.random() * 6) + 5 }, (_, i) => {
      const badgeType = badgeTypes[Math.floor(Math.random() * badgeTypes.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      
      return {
        id: i + 1,
        name: badgeType.name,
        level: level,
        icon: badgeType.icon,
        color: colors[level],
        starsEarned: Math.floor(Math.random() * 5) + 1,
        maxStars: 5
      };
    });
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
    if (count === 1) return "bg-green-900";
    if (count === 2) return "bg-green-700";
    if (count === 3) return "bg-green-500";
    return "bg-green-400";
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
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600 mb-2">
            HackerRank Profile Dashboard
          </h1>
          <p className="text-gray-400">Track your HackerRank progress and achievements</p>
        </div>
        
        {/* Username Input */}
        <div className={`relative mb-8 ${inputFocus ? 'scale-105' : ''} transition-all duration-300`}>
          <div className={`bg-gray-800 p-1 rounded-lg border-2 flex items-center overflow-hidden ${inputFocus ? 'border-green-500 shadow-lg shadow-green-500/30' : 'border-gray-700'}`}>
            <input
              type="text"
              placeholder="Enter your HackerRank username"
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
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="h-32 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        )}

        {/* Profile Content */}
        {profile && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3">
                  {profile.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                <div className="flex items-center text-sm text-gray-400">
                  <User size={14} className="mr-1" />
                  <span>@{profile.username}</span>
                  {profile.verified && (
                    <span className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <Award size={18} className="text-green-500 mr-3" />
                  <span className="text-gray-400">Rank:</span>
                  <span className="ml-auto font-bold">{profile.rank.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Trophy size={18} className="text-yellow-500 mr-3" />
                  <span className="text-gray-400">Score:</span>
                  <span className="ml-auto font-bold">{profile.score.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Medal size={18} className="text-blue-500 mr-3" />
                  <span className="text-gray-400">Badges:</span>
                  <span className="ml-auto font-bold">{profile.badges}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Code size={18} className="text-purple-500 mr-3" />
                  <span className="text-gray-400">Problems Solved:</span>
                  <span className="ml-auto font-bold">{profile.problemsSolved}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Activity size={18} className="text-orange-500 mr-3" />
                  <span className="text-gray-400">Contests:</span>
                  <span className="ml-auto font-bold">{profile.contestsParticipated}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar size={18} className="text-indigo-500 mr-3" />
                  <span className="text-gray-400">Joined:</span>
                  <span className="ml-auto">{profile.joinDate}</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 text-xs rounded-full bg-gray-700 text-green-400 border border-green-900"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column - Activity and Submissions */}
            <div className="col-span-2 space-y-6">
              {/* Activity Heatmap */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity size={18} className="text-green-500 mr-2" />
                  Coding Activity (Last 12 Months)
                </h3>
                
                <div className="overflow-x-auto pb-2">
                  <div className="min-w-max">
                    <div className="grid grid-flow-col gap-1">
                      {generateHeatmapData().map((month, monthIndex) => (
                        <div key={monthIndex} className="space-y-1">
                          <div className="text-xs text-gray-500 h-4 text-center">{month.month}</div>
                          <div className="grid grid-flow-row gap-1">
                            {month.days.map((count, dayIndex) => (
                              <div 
                                key={dayIndex} 
                                className={`w-3 h-3 rounded-sm ${getActivityColor(count)}`}
                                title={`${month.month} ${dayIndex + 1}: ${count} submissions`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end items-center mt-2">
                  <div className="text-xs text-gray-500 mr-2">Less</div>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`w-3 h-3 rounded-sm ${getActivityColor(level)} mr-1`}
                    ></div>
                  ))}
                  <div className="text-xs text-gray-500">More</div>
                </div>
              </div>

              {/* Recent Submissions */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Code size={18} className="text-blue-500 mr-2" />
                  Recent Submissions
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-2 font-medium">Challenge</th>
                        <th className="pb-2 font-medium">Domain</th>
                        <th className="pb-2 font-medium">Difficulty</th>
                        <th className="pb-2 font-medium">Score</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                          <td className="py-3 pr-4">
                            <div className="font-medium">{submission.challenge}</div>
                            <div className="text-xs text-gray-400">{submission.submittedAt}</div>
                          </td>
                          <td className="py-3 pr-4">
                            <div>{submission.domain}</div>
                            <div className="text-xs text-gray-400">{submission.subdomain}</div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-1 text-xs rounded ${
                              submission.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' :
                              submission.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                              submission.difficulty === 'Hard' ? 'bg-orange-900/50 text-orange-400' :
                              submission.difficulty === 'Advanced' ? 'bg-red-900/50 text-red-400' :
                              'bg-purple-900/50 text-purple-400'
                            }`}>
                              {submission.difficulty}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center">
                              <span className="font-medium">{submission.score}</span>
                              <span className="text-gray-500 mx-1">/</span>
                              <span className="text-gray-400">{submission.maxScore}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs rounded flex items-center w-min whitespace-nowrap ${
                              submission.status === 'Solved' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                            }`}>
                              {submission.status === 'Solved' ? (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L13.586 8l-1.293-1.293a1 1 0 010-1.414zM7.707 5.293a1 1 0 010 1.414L6.414 8l1.293 1.293a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414l2-2a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                              )}
                              {submission.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Badges */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Award size={18} className="text-yellow-500 mr-2" />
                  Earned Badges
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div key={badge.id} className="bg-gray-750 border border-gray-700 rounded-lg p-4 flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${badge.color.replace('text-', 'bg-').replace('-400', '-900')}`}>
                        {badge.icon === 'Code' && <Code size={20} className={badge.color} />}
                        {badge.icon === 'Terminal' && <Code size={20} className={badge.color} />}
                        {badge.icon === 'Coffee' && <Code size={20} className={badge.color} />}
                        {badge.icon === 'Calendar' && <Calendar size={20} className={badge.color} />}
                        {badge.icon === 'BarChart2' && <BarChart2 size={20} className={badge.color} />}
                        {badge.icon === 'Database' && <Hash size={20} className={badge.color} />}
                        {badge.icon === 'Plus' && <Code size={20} className={badge.color} />}
                        {badge.icon === 'Cpu' && <Code size={20} className={badge.color} />}
                        {badge.icon === 'Function' && <Code size={20} className={badge.color} />}
                      </div>
                      <div>
                        <div className="font-medium">{badge.name}</div>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs font-medium ${badge.color}`}>{badge.level}</span>
                          <div className="ml-2 flex">
                            {[...Array(badge.maxStars)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={i < badge.starsEarned ? badge.color : 'text-gray-600'} 
                                fill={i < badge.starsEarned ? 'currentColor' : 'none'} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!profile && !loading && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <Trophy size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Welcome to HackerRank Dashboard!</h2>
            <p className="text-gray-300 mb-6">Enter your HackerRank username above to view your profile statistics, recent submissions, and earned badges.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="bg-gray-700 p-4 rounded-lg">
                <Code size={24} className="text-green-500 mb-2 mx-auto" />
                <h3 className="font-medium">Track Progress</h3>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <BarChart2 size={24} className="text-blue-500 mb-2 mx-auto" />
                <h3 className="font-medium">View Stats</h3>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <Medal size={24} className="text-yellow-500 mb-2 mx-auto" />
                <h3 className="font-medium">Showcase Badges</h3>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This is a demo dashboard and not affiliated with the official HackerRank platform.</p>
        </div>
      </div>
    </div>
  );
}

export default HackerRankProfileDashboard;