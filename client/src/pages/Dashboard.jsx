import { Sidebar } from "@/components/index.js"
import { Outlet } from "react-router-dom"



const Dashboard = () => {


  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  )
} 

export default Dashboard