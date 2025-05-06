import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaLightbulb } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";

const ResultCard = ({ title, icon, color, items }) => (
  <div className="bg-white/90 rounded-xl shadow-md p-6 flex-1 min-w-[220px]">
    <div className="flex items-center mb-4">
      <span className={`mr-2 text-xl`} style={{ color }}>{icon}</span>
      <span className="font-semibold text-gray-700">{title}</span>
    </div>
    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
      {items.length > 0 ? items.map((item, i) => <li key={i}>{item}</li>) : <li>—</li>}
    </ul>
  </div>
);

const ScoreCircle = ({ label, value, color }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < value) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 10);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="flex flex-col items-center mb-0">
      <svg
        viewBox="0 0 120 60"
        className="w-36 h-18 overflow-visible"
      >
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="#e0e7ef"
          strokeWidth="12"
        />
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray="157"
          strokeDashoffset={157 - (157 * progress) / 100}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
      <span className="text-2xl font-light text-gray-800 mt-4">{progress}%</span>
      <span className="text-base font-medium text-gray-600">{label}</span>
    </div>
  );
};

const ResumeResults = ({ data }) => (
  <div className="w-full max-w-5xl mx-auto mt-10">
    <div className="flex justify-center gap-8 mb-10">
      <ScoreCircle label="Content" value={data.content_analysis.score} color="#6366f1" />
      <ScoreCircle label="Formatting" value={data.formatting_analysis.score} color="#34d399" />
    </div>
    <div className="flex flex-col items-center gap-8">
      <div className="w-full max-w-3xl animate-fade-in-up">
        <ResultCard
          title="Δυνατά Σημεία"
          icon={<FaCheckCircle />}
          color="#34d399"
          items={data.content_analysis.strong_points}
        />
      </div>
      <div className="w-full max-w-3xl animate-fade-in-up">
        <ResultCard
          title="Σημεία Βελτίωσης"
          icon={<FaExclamationCircle />}
          color="#f59e42"
          items={data.content_analysis.weak_points}
        />
      </div>
      <div className="w-full max-w-3xl animate-fade-in-up">
        <ResultCard
          title="Προτάσεις"
          icon={<FaLightbulb />}
          color="#6366f1"
          items={data.content_analysis.improvement_suggestions}
        />
      </div>
      <div className="w-full max-w-3xl animate-fade-in-up">
        <ResultCard
          title="Μορφοποίηση"
          icon={<FaLightbulb />}
          color="#6366f1"
          items={data.formatting_analysis.suggestions}
        />
      </div>
    </div>
    <div className="mt-12 flex justify-center">
      <button className="w-full mb-5 max-w-lg py-3 rounded-lg font-semibold text-white transition shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
        Θέλεις επιπλέον βελτίωση; Δες συμβουλές!
      </button>
    </div>
  </div>
);

export default ResumeResults;
