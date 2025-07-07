import { createContext, useState } from "react";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";

export const SidebarContext = createContext();

const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-r border-purple-500/30 shadow-xl backdrop-blur-md">
        {/* Top Logo and Toggle */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1
            className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 overflow-hidden transition-all duration-300 ${expanded ? "w-52" : "w-0"}`}
          >
            SentiScope
          </h1>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg hover:bg-lime-400 hover:text-gray-800 transition"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded, setExpanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        {/* Bottom User Info */}
        <div className="border-t border-purple-500/20 flex p-3">
          <img
            src="https://ui-avatars.com/api/?name=Toheed+Khan&background=c7d2fe&color=3730a3&bold=true"
            alt="User"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all duration-300 ${expanded ? "w-52 ml-3" : "w-0"}`}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">Toheed Ullah</h4>
              <span className="text-xs text-gray-400">toheedullah002@gmail.com</span>
            </div>
            <MoreVertical size={20} className="text-gray-400" />
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
