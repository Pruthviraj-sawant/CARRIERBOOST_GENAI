import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 1) {
        axios.get(`/api/users/search?q=${query}`)
          .then(res => setResults(res.data))
          .catch(err => console.log(err));
      } else {
        setResults([]);
      }
    }, 300); // debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="max-w-xl mx-auto ">
      <input
        type="text"
        placeholder="Search users by name, email, or username..."
        className="w-10rem h-8 border px-4 py-2 rounded-md shadow-md border-black focus:outline-none focus:ring-2 focus:ring-blue-500 "
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map(user => (
            <div key={user._id} className="p-4 bg-white shadow rounded">
              <h2 className="font-bold">{user.name}</h2>
              <p>{user.email}</p>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
