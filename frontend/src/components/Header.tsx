import React from "react";

const Header = () => (
  <header className="w-full bg-white/80 backdrop-blur shadow-sm py-6 mb-10">
    <div className="max-w-3xl mx-auto px-4 flex items-center justify-center">
      <span className="text-3xl font-extrabold text-gray-900 tracking-tight select-none">
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-400 bg-clip-text text-transparent">Resume Checker</span>
      </span>
    </div>
  </header>
);

export default Header;