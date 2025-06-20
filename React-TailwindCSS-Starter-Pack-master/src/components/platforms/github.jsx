import { useState ,useEffect} from "react";
import { Search, User, Code, GitBranch, Star, Activity } from "lucide-react";

function SimpleGithubProfileFetcher() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);


    useEffect(() => {
      const savedUsername = localStorage.getItem("githubUsername");
      if (savedUsername) {
        setUsername(savedUsername);
      }
    }, []);
  
    // Debounced search when username changes
    useEffect(() => {
      const delayDebounce = setTimeout(() => {
        if (username.trim()) {
          localStorage.setItem("githubUsername", username); // Save to localStorage
          fetchProfile();
        }
      }, 600); // debounce time
  
      return () => clearTimeout(delayDebounce);
    }, [username]);

  const fetchProfile = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty!");
      return;
    }
    setLoading(true);
    setError("");
    setProfile(null);
    setRepos([]);

    try {
      // Fetch user profile
      const profileResponse = await fetch(`https://api.github.com/users/${username}`);
      
      if (!profileResponse.ok) {
        throw new Error("User not found");
      }
      
      const profileData = await profileResponse.json();
      setProfile(profileData);
      
      // Fetch top repos
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
      const reposData = await reposResponse.json();
      setRepos(reposData);
      
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchProfile();
    }
  };
  
  return (
    <div className="min-h-screen bg-white text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-2">
            GitHub Profile Explorer
          </h1>
          <p className="text-gray-400">Discover GitHub profiles and their top repositories</p>
        </div>
        
        {/* Search Box */}
        {/* <div className={`relative mb-8 ${searchFocus ? 'scale-105' : ''} transition-all duration-300`}>
          <div className={`bg-gray-800 p-1 rounded-lg border-2 flex items-center overflow-hidden ${searchFocus ? 'border-blue-500 shadow-lg shadow-blue-500/30' : 'border-gray-700'}`}>
            <input
              type="text"
              placeholder="Enter GitHub username"
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
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
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
              ) : "Search"}
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
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 border-b border-gray-700">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  <img
                    src={profile.avatar_url}
                    alt={profile.login}
                    className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-lg"
                  />
                  {profile.hireable && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-gray-800">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="text-center sm:text-left flex-grow">
                  <h2 className="text-2xl font-bold">{profile.name || profile.login}</h2>
                  <a 
                    href={`https://github.com/${profile.login}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center justify-center sm:justify-start"
                  >
                    @{profile.login}
                  </a>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
                    {profile.company && (
                      <span className="inline-flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        {profile.company}
                      </span>
                    )}
                    {profile.location && (
                      <span className="inline-flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {profile.location}
                      </span>
                    )}
                    {profile.blog && (
                      <a 
                        href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                        </svg>
                        Website
                      </a>
                    )}
                  </div>
                  
                  {profile.bio && (
                    <p className="mt-3 text-gray-300 text-sm">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="p-4 border-b border-gray-700 bg-gray-800/50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-center mb-1">
                    <User className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-xs font-medium text-gray-400">Followers</span>
                  </div>
                  <span className="text-xl font-bold">{profile.followers}</span>
                </div>
                
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-center mb-1">
                    <User className="w-4 h-4 text-purple-400 mr-1" />
                    <span className="text-xs font-medium text-gray-400">Following</span>
                  </div>
                  <span className="text-xl font-bold">{profile.following}</span>
                </div>
                
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-center mb-1">
                    <Code className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-xs font-medium text-gray-400">Repos</span>
                  </div>
                  <span className="text-xl font-bold">{profile.public_repos}</span>
                </div>
                
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-center mb-1">
                    <Code className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-xs font-medium text-gray-400">Gists</span>
                  </div>
                  <span className="text-xl font-bold">{profile.public_gists}</span>
                </div>
              </div>
            </div>
            
            {/* Recent Repositories */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <GitBranch className="w-5 h-5 mr-2" />
                Recent Repositories
              </h3>
              
              {repos.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No public repositories found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {repos.map(repo => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-blue-400">{repo.name}</h4>
                          {repo.description && (
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{repo.description}</p>
                          )}
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            {repo.language && (
                              <span className="flex items-center mr-3">
                                <span className="w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                                {repo.language}
                              </span>
                            )}
                            <span className="flex items-center mr-3">
                              <Star className="w-3 h-3 mr-1" />
                              {repo.stargazers_count}
                            </span>
                            <span className="flex items-center">
                              <GitBranch className="w-3 h-3 mr-1" />
                              {repo.forks_count}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          Updated: {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleGithubProfileFetcher;