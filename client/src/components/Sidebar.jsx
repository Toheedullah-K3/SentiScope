import { SidebarItemParent, SidebarItem } from "@/components/index";
import { useNavigate } from "react-router-dom";
import {
  LifeBuoy,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  Settings,
  RefreshCw,
  BookMarked,
  Sparkles,
  Brain,
  HelpCircle
} from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [selected, setSelected] = useState("Search & Analyze");
  const navigate = useNavigate();

  return (
    <SidebarItemParent>
      <SidebarItem
        icon={<Sparkles />}
        text="Search & Analyze"
        hoverText="Analyze"
        active={selected === "Search & Analyze"}
        onClick={() => {
          navigate("/dashboard/sentiment-analysis");
          setSelected("Search & Analyze");
        }}
      />
      <SidebarItem
        icon={<BarChart3 />}
        text="Compare Trends"
        hoverText="Compare"
        active={selected === "Compare Trends"}
        onClick={() => {
          navigate("/dashboard/compare-trends");
          setSelected("Compare Trends");
        }}
      />
      <SidebarItem
        icon={<BookMarked />}
        text="History & Saved"
        hoverText="History"
        active={selected === "History & Saved"}
        onClick={() => {
          navigate("/dashboard/saved-analysis");
          setSelected("History & Saved");
        }}
      />
      <SidebarItem
        icon={<Brain />}
        text="Sentiments"
        hoverText="Sentiments"
        active={selected === "Sentiments"}
        onClick={() => {
          navigate("");
          setSelected("Sentiments");
        }}
      />
      <SidebarItem
        icon={<Boxes />}
        text="Cluster"
        hoverText="Cluster"
        active={selected === "Cluster"}
        onClick={() => {
          navigate("/dashboard/cluster-analysis");
          setSelected("Cluster");
        }}
      />
      <SidebarItem
        icon={<Settings />}
        text="Settings"
        hoverText="Settings"
        active={selected === "Settings"}
        onClick={() => {
          navigate("");
          setSelected("Settings");
        }}
      />
      <SidebarItem
        icon={<HelpCircle />}
        text="Help"
        hoverText="Help"
        active={selected === "Help"}
        onClick={() => {
          navigate("/dashboard/help");
          setSelected("Help");
        }}
      />
    </SidebarItemParent>
  );
};

export default Dashboard;
