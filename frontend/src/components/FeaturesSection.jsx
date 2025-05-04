import React from "react";
import { FaCheck, FaClipboard, FaFileAlt, FaLightbulb } from "react-icons/fa";

const features = [
  {
    icon: <FaCheck className="text-blue-600 w-8 h-8" />,
    title: "Ανάλυση Περιεχομένου",
    description: "Λάβετε πληροφορίες για τα δυνατά και αδύνατα σημεία του περιεχομένου του βιογραφικού σας."
  },
  {
    icon: <FaClipboard className="text-blue-600 w-8 h-8" />,
    title: "Ετοιμότητα για ATS",
    description: "Βεβαιωθείτε ότι το βιογραφικό σας περνάει εύκολα από τα Applicant Tracking Systems."
  },
  {
    icon: <FaFileAlt className="text-blue-600 w-8 h-8" />,
    title: "Ανατροφοδότηση Μορφοποίησης",
    description: "Λάβετε συμβουλές για τη βελτίωση της διάταξης και του σχεδιασμού του βιογραφικού σας."
  },
  {
    icon: <FaLightbulb className="text-blue-600 w-8 h-8" />,
    title: "Προτάσεις Βελτίωσης",
    description: "Λάβετε εξατομικευμένες προτάσεις για να κάνετε το βιογραφικό σας να ξεχωρίζει."
  }
];

const FeaturesSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-12 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
        Γιατί να χρησιμοποιήσετε το εργαλείο μας;
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;