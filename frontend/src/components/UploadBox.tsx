import React from "react";
import { FaFileAlt, FaUpload } from "react-icons/fa";

interface UploadBoxProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  file: File | null;
  loading: boolean;
  error: string;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onFileChange, onSubmit, file, loading, error }) => (
  <form onSubmit={onSubmit} className="w-full max-w-lg mx-auto bg-white/90 shadow-lg rounded-xl p-8 flex flex-col items-center space-y-6">
    <div className="w-full flex flex-col items-center">
      <label className="w-full flex flex-col items-center justify-center h-48 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition">
        <div className="flex flex-col items-center justify-center py-6">
          <FaFileAlt className="w-12 h-12 text-blue-400 mb-2" />
          <span className="text-lg font-light text-gray-700">Ανεβάστε το βιογραφικό σας</span>
          <span className="text-xs text-gray-400 mt-1">PDF ή DOCX</span>
        </div>
        <input type="file" className="hidden" onChange={onFileChange} accept=".pdf,.docx" />
      </label>
      {file && (
        <div className="mt-3 flex items-center text-sm text-green-600">
          <FaUpload className="mr-2" /> {file.name}
        </div>
      )}
      {error && (
        <div className="mt-3 text-sm text-red-500">{error}</div>
      )}
    </div>
    <button
      type="submit"
      disabled={!file || loading}
      className={`w-full py-3 rounded-lg font-semibold text-white transition shadow-md ${
        !file || loading
          ? "bg-blue-200 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500"
      }`}
    >
      {loading ? "Γίνεται επεξεργασία..." : "Ανάλυση Βιογραφικού"}
    </button>
  </form>
);

export default UploadBox;