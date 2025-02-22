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
          text="Search & Analyze" 
          hoverText= "Analyze"
          active= {selected === "Search & Analyze"} 
          onClick={()=> {
            navigate('') 
            setSelected("Search & Analyze")
          }} 
        />
        <SidebarItem 
          icon={<UserCircle size={20}/> } 
          text="Compare Trends"
          hoverText= "Compare"
          active= {selected === "Compare Trends"} 
          onClick={()=> {
            navigate('') 
            setSelected("Compare Trends")
          }}
        />
        <SidebarItem 
          icon={<Boxes size={20}/> } 
          text="History & Saved Analysis"  
          hoverText= "History"
          active= {selected === "History & Saved Analysis"} 
          onClick={()=> {
            navigate('') 
            setSelected("History & Saved Analysis")
          }}
        />
        <SidebarItem 
          icon={<Package size={20}/> } 
          text="Sentiments" alert
          hoverText= "Sentiments"
          active= {selected === "Sentiments"} 
          onClick={()=> {
            navigate('') 
            setSelected("Sentiments")
          }}
        />
        <SidebarItem 
          icon={<Receipt size={20}/> } 
          text="Cluster" 
          hoverText= "Cluster"
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
          hoverText= "Settings"
          active= {selected === "Settings"} 
          onClick={()=> {
            navigate('') 
            setSelected("Settings")}}
        />
        <SidebarItem 
          icon={<LifeBuoy size={20}/> } 
          text="Help" 
          hoverText= "Help"
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