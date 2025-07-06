import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-3 border border-gray-700 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:border-cyan-600">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-6 py-4 bg-gray-800 text-left text-white font-semibold text-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-200"
      >
        <span className="flex-1">{title}</span>
        {open ? (
          <ChevronUp className="w-6 h-6 text-cyan-400 transition-transform duration-200 transform rotate-180" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-400 transition-transform duration-200" />
        )}
      </button>
      {open && (
        <div className="px-6 py-4 bg-gray-850 text-gray-200 text-base leading-relaxed animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;