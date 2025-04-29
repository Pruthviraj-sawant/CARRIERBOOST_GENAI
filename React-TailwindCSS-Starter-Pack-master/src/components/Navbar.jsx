import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
        CareerBoost
        </Link>
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li>
            <Link to="/letter-generator" className="hover:text-blue-500 transition">
              letter-generator
            </Link>
          </li>
          <li>
            <Link to="/ai-interviewer" className="hover:text-blue-500 transition">
            ai-interviewer
            </Link>
          </li>
          <li>
            <Link to="/resume-chechker" className="hover:text-blue-500 transition">
            resume-chechker
            </Link>
          </li>
          <li>
            <Link to="/leetecode-traker" className="hover:text-blue-500 transition">
            leetecode-traker
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
