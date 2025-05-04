import React from "react";
import UploadBox from "./UploadBox";

const HeroSection = ({ onFileChange, onSubmit, file, loading, error }) => (
  <section className="relative bg-gradient-to-r from-blue-100 via-gray-100 to-blue-50 text-gray-800 py-20 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-gray-100 to-blue-50 animate-gradient-x"></div>
    <div className="container mx-auto px-6 text-center md:text-left relative z-10">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
            Είναι το βιογραφικό σας αρκετά καλό;
          </h1>
          <p className="text-lg md:text-xl font-light mb-6">
            Ανεβάστε το βιογραφικό σας και λάβετε άμεση ανατροφοδότηση για να το βελτιώσετε. Αναλύστε το περιεχόμενο, τη μορφοποίηση και την ετοιμότητα για ATS.
          </p>
          <UploadBox
            onFileChange={onFileChange}
            onSubmit={onSubmit}
            file={file}
            loading={loading}
            error={error}
          />
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end">
          <iframe
            src="https://lottie.host/embed/f828c0c3-de58-4d0f-81f8-7e9a495fefe7/TQpwfqh9qK.lottie"
            title="Resume Animation"
            className="w-full max-w-md"
            style={{ height: "300px", marginRight: "20px" }}
          ></iframe>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;