import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ResumeResultsProps {
  data: {
    content_analysis: {
      score: number;
      strong_points: string[];
      weak_points: string[];
      improvement_suggestions: string[];
    };
    formatting_analysis: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      suggestions: string[];
    };
  };
}

const Section: React.FC<{
  title: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  color: string;
}> = ({ title, score, strengths, weaknesses, suggestions, color }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4" style={{ borderTopColor: color }}>
    <div className="mb-4">
      <div style={{ width: 120, height: 120 }}>
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: color,
            trailColor: '#e5e7eb',
            textSize: '22px',
            pathTransitionDuration: 0.7,
          })}
          strokeWidth={12}
        />
      </div>
    </div>
    <h3 className="text-lg font-bold mb-4 text-blue-900 uppercase tracking-wide">{title}</h3>
    <div className="w-full space-y-4 text-sm">
      <div>
        <h4 className="font-semibold text-green-700 mb-1">Δυνατά Σημεία</h4>
        <ul className="list-disc list-inside text-gray-800">
          {strengths.length > 0 ? strengths.map((s, i) => <li key={i}>{s}</li>) : <li>—</li>}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-red-700 mb-1">Σημεία Βελτίωσης</h4>
        <ul className="list-disc list-inside text-gray-800">
          {weaknesses.length > 0 ? weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>—</li>}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-blue-700 mb-1">Προτάσεις</h4>
        <ul className="list-disc list-inside text-gray-800">
          {suggestions.length > 0 ? suggestions.map((s, i) => <li key={i}>{s}</li>) : <li>—</li>}
        </ul>
      </div>
    </div>
  </div>
);

const ResumeResults: React.FC<ResumeResultsProps> = ({ data }) => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      <Section
        title="Περιεχόμενο"
        score={data.content_analysis.score}
        strengths={data.content_analysis.strong_points}
        weaknesses={data.content_analysis.weak_points}
        suggestions={data.content_analysis.improvement_suggestions}
        color="#003366"
      />
      <Section
        title="Μορφοποίηση"
        score={data.formatting_analysis.score}
        strengths={data.formatting_analysis.strengths}
        weaknesses={data.formatting_analysis.weaknesses}
        suggestions={data.formatting_analysis.suggestions}
        color="#0f766e"
      />
    </div>
  );
};

export default ResumeResults;
