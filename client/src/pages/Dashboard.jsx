import { Sidebar } from "@/components";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full z-40 w-64 hidden md:block">
        <Sidebar />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 ml-0 md:ml-64 overflow-y-auto overflow-x-visible h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
