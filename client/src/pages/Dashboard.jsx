import { Sidebar } from "@/components";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full overflow-x-visible">
      {/* Sidebar (fixed width) */}
      <Sidebar />

      {/* Outlet content (full width, no unwanted padding) */}
      <div className="flex-1 overflow-y-auto overflow-x-visible">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
