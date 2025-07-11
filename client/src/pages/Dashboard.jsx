import { Sidebar } from "@/components";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full overflow-x-visible relative">
      <Sidebar />
      <div className="flex-1 overflow-y-auto overflow-x-visible sm:ml-64 md:ml-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
