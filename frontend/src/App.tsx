import React, { useState } from 'react';
import ResumeResults from './components/ResumeResults';

interface AnalysisResult {
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
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Παρακαλώ επιλέξτε ένα αρχείο');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Σφάλμα κατά την ανάλυση του βιογραφικού');
      }

      const data: AnalysisResult = await response.json();
      console.log('AI RESPONSE:', data, typeof data);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ένα σφάλμα προέκυψε');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Αναλυτής Βιογραφικού</h1>
          <p className="mt-2 text-gray-600">
            Ανεβάστε το βιογραφικό σας για να λάβετε αναλυτική αξιολόγηση
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Επιλέξτε αρχείο βιογραφικού
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                ${loading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {loading ? 'Ανάλυση σε εξέλιξη...' : 'Ανάλυση Βιογραφικού'}
            </button>
          </form>
        </div>

        {results && <ResumeResults data={results} />}
      </div>
    </div>
  );
}

export default App; 