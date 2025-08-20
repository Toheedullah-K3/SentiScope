import { Sidebar } from "@/components";
import { Outlet } from "react-router-dom";
import { SidebarContext } from "@/components/SidebarItemParent"; 
import { useState } from "react";

const Dashboard = () => {
  const [expanded, setExpanded] = useState(true); 

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <div className="flex w-full h-screen overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="fixed top-0 left-0 h-full z-40 hidden md:block transition-all duration-300">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 overflow-y-auto h-full transition-all duration-300 ${
            expanded ? "lg:ml-64" : "lg:ml-16"
          }`} 
        > 
          <Outlet />
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Dashboard;
