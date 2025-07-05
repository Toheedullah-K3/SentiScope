import { Sidebar } from "@/components/index.js"
import { Outlet } from "react-router-dom"



const Dashboard = () => {


  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
        <Outlet />
      </div>
    </div>
  )
} 

export default Dashboard