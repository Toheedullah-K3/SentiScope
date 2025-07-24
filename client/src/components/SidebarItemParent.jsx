import { createContext, useContext, useState } from "react";
import { ChevronFirst, ChevronLast, MoreVertical, Menu } from "lucide-react";


export const SidebarContext = createContext();

const Sidebar = ({ children }) => {
  const { expanded, setExpanded } = useContext(SidebarContext);
  const [visible, setVisible] = useState(false); // For mobile toggle

  return (
    <>
    
      {/* Hamburger button (only on small screens) */}
      <button
        onClick={() => setVisible(!visible)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-purple-700 text-white rounded-md shadow-lg"
      >
        <Menu />
      </button>

      <aside
        className={`h-screen fixed z-40 transition-transform duration-300 md:relative
          ${visible ? "translate-x-0" : "-translate-x-full"}
          ${expanded ? "w-64" : "w-16"} transition-all duration-300
          md:translate-x-0 md:flex`}
      >
        <nav className={`relative h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-r border-purple-500/30 shadow-xl backdrop-blur-md overflow-visible `}>
          {/* Top Logo and Toggle */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <h1
              className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 transition-all duration-300 ${expanded ? "w-52" : "w-0"}`}
            >
              SentiScope
            </h1> 
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 mx-auto rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white transition hidden md:block"
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
              className="w-10 h-10 rounded-md mx-auto"
            />
            <div className={`flex justify-between items-center transition-all duration-300 ${expanded ? "w-52 ml-3" : "w-0"}`}>
              <div className={`flex flex-col ${expanded ? "opacity-100" : "opacity-0"}`}>
                <h4 className="font-semibold text-white">Toheed Ullah</h4>
                <span className="text-xs text-gray-400">toheedullah002@gmail.com</span>
              </div>
              <MoreVertical size={20} className="text-gray-400" />
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
