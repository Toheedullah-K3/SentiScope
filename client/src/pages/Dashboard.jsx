import { Sidebar, SidebarItem } from "@/components/index"
import { useNavigate } from "react-router-dom"
import { Outlet } from "react-router-dom"

import {
  LifeBuoy,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  Settings
} from "lucide-react"
import { useState } from "react"

const Dashboard = () => {
  const [selected, setSelected] = useState("Statistics")
  const navigate = useNavigate()

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarItem 
          icon={<BarChart3 size={20}/> } 
          text="Statistics" 
          active= {selected === "Statistics"} 
          onClick={()=> {
            navigate('') 
            setSelected("Statistics")
          }} 
        />
        <SidebarItem 
          icon={<UserCircle size={20}/> } 
          text="Users"
          active= {selected === "Users"} 
          onClick={()=> {
            navigate('') 
            setSelected("Users")
          }}
        />
        <SidebarItem 
          icon={<Boxes size={20}/> } 
          text="Product"  
          active= {selected === "Product"} 
          onClick={()=> {
            navigate('') 
            setSelected("Product")
          }}
        />
        <SidebarItem 
          icon={<Package size={20}/> } 
          text="Sentiments" alert
          active= {selected === "Sentiments"} 
          onClick={()=> {
            navigate('') 
            setSelected("Sentiments")
          }}
        />
        <SidebarItem 
          icon={<Receipt size={20}/> } 
          text="Cluster" 
          active= {selected === "Cluster"} 
          onClick={()=> {
            navigate('') 
            setSelected("Cluster")
          }}
        />
        <hr className="my-3"/>
        <SidebarItem 
          icon={<Settings size={20}/> } 
          text="Settings" 
          active= {selected === "Settings"} 
          onClick={()=> {
            navigate('') 
            setSelected("Settings")}}
        />
        <SidebarItem 
          icon={<LifeBuoy size={20}/> } 
          text="Help" 
          active= {selected === "Help"} 
          onClick={()=> {
            navigate('') 
            setSelected("Help")
          }}
        />
      </Sidebar>

      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  )
} 

export default Dashboard