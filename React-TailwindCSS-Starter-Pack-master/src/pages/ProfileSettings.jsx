import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    country: '',
    college: '',
    degree: '',
    branch: '',
    yearOfGraduation: '',
    leetcode: '',
    codeforces: '',
    github: '',
    codechef: '',
    hackerrank: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFormData(res.data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put('http://localhost:5000/api/user/profile', formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    alert('Profile Updated!');
  };
  console.log(localStorage.getItem('token')); // Should show your JWT token


  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {Object.keys(formData).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          value={formData[key] || ''}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      ))}
      <button className="bg-blue-500 text-white px-4 py-2">Update</button>
    </form>
  );
};

export default ProfileSettings;
