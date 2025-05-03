import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaCheckCircle, FaExclamationCircle, FaLightbulb } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";

const ResultCard = ({ title, icon, color, items }) => (
  <div className="bg-white/90 rounded-xl shadow-md p-6 flex-1 min-w-[220px]">
    <div className="flex items-center mb-2">
      <span className={`mr-2 text-xl`} style={{ color }}>{icon}</span>
      <span className="font-semibold text-gray-700">{title}</span>
    </div>
    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
      {items.length > 0 ? items.map((item, i) => <li key={i}>{item}</li>) : <li>—</li>}
    </ul>
  </div>
);

const ScoreCircle = ({ label, value, color }) => (
  <div className="flex flex-col items-center">
    <div className="w-28 h-28 mb-2">
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          pathColor: color,
          textColor: color,
          trailColor: "#e0e7ef",
          textSize: "1.5rem",
        })}
        strokeWidth={10}
      />
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
);

const ResumeResults = ({ data }) => (
  <div className="w-full max-w-5xl mx-auto mt-10">
    <div className="flex flex-col md:flex-row justify-center gap-8 mb-10">
      <ScoreCircle label="Content" value={data.content_analysis.score} color="#6366f1" />
      <ScoreCircle label="Formatting" value={data.formatting_analysis.score} color="#34d399" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ResultCard
        title="Δυνατά Σημεία"
        icon={<FaCheckCircle />}
        color="#34d399"
        items={data.content_analysis.strong_points}
      />
      <ResultCard
        title="Σημεία Βελτίωσης"
        icon={<FaExclamationCircle />}
        color="#f59e42"
        items={data.content_analysis.weak_points}
      />
      <ResultCard
        title="Προτάσεις"
        icon={<FaLightbulb />}
        color="#6366f1"
        items={data.content_analysis.improvement_suggestions}
      />
      <ResultCard
        title="Μορφοποίηση"
        icon={<FaLightbulb />}
        color="#6366f1"
        items={data.formatting_analysis.suggestions}
      />
    </div>
    <div className="mt-12 flex justify-center">
      <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-green-500 transition">
        Θέλεις επιπλέον βελτίωση; Δες συμβουλές!
      </button>
    </div>
  </div>
);

export default ResumeResults;
