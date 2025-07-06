import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 border border-gray-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-4 py-3 bg-gray-700 text-left text-white hover:bg-gray-600"
      >
        <span className="font-medium">{title}</span>
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {open && <div className="px-4 py-3 bg-gray-800 text-sm text-gray-300">{children}</div>}
    </div>
  );
};

export default Accordion;
