import React from "react";

const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-6"></div>
    <span className="text-lg text-gray-700 font-medium">Γίνεται επεξεργασία…</span>
  </div>
);

export default LoadingIndicator;