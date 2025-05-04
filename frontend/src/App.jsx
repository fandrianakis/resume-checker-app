import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
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

  useEffect(() => {
    if (analysis) {
      const resultsSection = document.getElementById("results-section");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [analysis]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ef] font-sans">
      <Header />
      <HeroSection
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        file={file}
        loading={loading}
        error={error}
      />
      <FeaturesSection />
      <main id="results-section" className="relative flex flex-col items-center justify-center px-4 mt-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-gray-100 to-blue-50 animate-gradient-x"></div>
        <div className="relative z-10">
          {analysis && <ResumeResults data={analysis} />}
        </div>
      </main>
    </div>
  );
};

export default App;