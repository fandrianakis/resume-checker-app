import { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import ResumeResults from './components/ResumeResults';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Μη επιτρεπτός τύπος αρχείου. Επιτρέπονται μόνο PDF και DOCX.');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setAnalysis(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Σφάλμα κατά το upload του αρχείου');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Resume Checker
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Ανεβάστε το βιογραφικό σας και λάβετε αναλυτική ανάλυση
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Κάντε κλικ για να ανεβάσετε</span> ή σύρετε το αρχείο
                  </p>
                  <p className="text-xs text-gray-500">PDF ή DOCX</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                />
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-center text-sm text-gray-600">
                <FaCheck className="w-4 h-4 mr-2 text-green-500" />
                {file.name}
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center text-sm text-red-600">
                <FaTimes className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!file || loading}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  !file || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Αναλύεται...
                  </div>
                ) : (
                  'Ανάλυση Βιογραφικού'
                )}
              </button>
            </div>
          </form>

          {analysis && <ResumeResults data={analysis} />}
        </div>
      </div>
    </div>
  );
}

export default App;