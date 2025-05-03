import React, { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import UploadBox from "./components/UploadBox";
import LoadingIndicator from "./components/LoadingIndicator";
import ResumeResults from "./components/ResumeResults";

const App = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Μη επιτρεπτός τύπος αρχείου. Επιτρέπονται μόνο PDF και DOCX.");
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    setAnalysis(null);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Σφάλμα κατά το upload του αρχείου");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ef] font-sans">
      <Header />
      <main className="flex flex-col items-center justify-center px-4">
        {!analysis && !loading && (
          <UploadBox
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            file={file}
            loading={loading}
            error={error}
          />
        )}
        {loading && <LoadingIndicator />}
        {analysis && <ResumeResults data={analysis} />}
      </main>
    </div>
  );
};

export default App;