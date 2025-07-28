import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp, 
} from "lucide-react";

const Accordion = ({ title, children, icon: Icon }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 border border-purple-400/30 rounded-xl overflow-hidden bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-400/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-6 py-4 text-left text-white hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-indigo-900/30 transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />}
          <span className="font-semibold text-lg">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          {open ? <ChevronUp className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-all duration-300" /> : <ChevronDown className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-all duration-300" />}
        </div>
      </button>
      {open && (
        <div className="px-6 py-4 bg-gradient-to-r from-slate-800/70 to-slate-900/70 border-t border-purple-400/20">
          <div className="text-gray-300 leading-relaxed">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Accordion;