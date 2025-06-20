
import React from 'react';

export default function Footer() {
  return (  


<footer className="bg-white text-black px-6 py-10 mt-24 border-t-2 border-gray-200">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
    
    {/* <!-- Logo & Description --> */}
    <div>
      <h2 class="text-2xl font-bold text-blue-400">Career Boost</h2>
      <p class="mt-4 text-sm text-gray-900">
        Empowering your future with job-ready skills, industry-relevant training, and personalized career guidance.
      </p>
    </div>

    {/* <!-- Quick Links --> */}
    <div>
      <h3 class="text-xl font-semibold mb-4">Quick Links</h3>
      <ul class="space-y-2 text-gray-900">
        <li><a href="/" class="hover:text-white">Home</a></li>
        <li><a href="" class="hover:text-white">Courses</a></li>
        <li><a href="#" class="hover:text-white">Mentorship</a></li>
        <li><a href="#" class="hover:text-white">Contact</a></li>
      </ul>
    </div>

    {/* <!-- Resources --> */}
    <div>
      <h3 class="text-xl font-semibold mb-4">Resources</h3>
      <ul class="space-y-2 text-gray-900">
        <li><a href="#" class="hover:text-white">Blog</a></li>
        <li><a href="#" class="hover:text-white">FAQs</a></li>
        <li><a href="#" class="hover:text-white">Career Tips</a></li>
        <li><a href="#" class="hover:text-white">Webinars</a></li>
      </ul>
    </div>

    {/* <!-- Contact Info --> */}
    <div>
      <h3 class="text-xl font-semibold mb-4">Get in Touch</h3>
      <p class="text-gray-900">Email: <a href="mailto:info@careerboost.com" class="hover:text-white">info@careerboost.com</a></p>
      <p class="text-gray-900">Phone: <a href="tel:+919876543210" class="hover:text-white">+91 98765 43210</a></p>
      <div class="mt-4 flex space-x-4">
        <a href="#" class="hover:text-blue-500"><i class="fab fa-facebook"></i></a>
        <a href="#" class="hover:text-blue-400"><i class="fab fa-twitter"></i></a>
        <a href="#" class="hover:text-pink-500"><i class="fab fa-instagram"></i></a>
        <a href="#" class="hover:text-blue-700"><i class="fab fa-linkedin"></i></a>
      </div>
    </div>

  </div>

  <div class="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
    © 2025 Career Boost. All rights reserved.
  </div>
</footer>
  );
}

