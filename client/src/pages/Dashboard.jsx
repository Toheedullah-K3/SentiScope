import { Sidebar, SidebarItem } from "@/components/index"
import {
  LifeBuoy,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  Settings
} from "lucide-react"

const Dashboard = () => {

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarItem icon={<BarChart3 size={20}/> } text="Statistics" active />
        <SidebarItem icon={<UserCircle size={20}/> } text="Users" />
        <SidebarItem icon={<Boxes size={20}/> } text="Users" />
        <SidebarItem icon={<Package size={20}/> } text="Users" alert/>
        <SidebarItem icon={<Receipt size={20}/> } text="Billings" />
        <hr className="my-3"/>
        <SidebarItem icon={<Settings size={20}/> } text="Settings" />
        <SidebarItem icon={<LifeBuoy size={20}/> } text="Help" />
      </Sidebar>

      <div className="flex-1 p-4">
        <h1 className="text-xl font-semibold">Dashboard Content</h1>
      </div>
    </div>
  )
} 

export default Dashboard