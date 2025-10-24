import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Wifi,
  Database,
  Receipt,
  BarChart,
  Settings,
  LifeBuoy,
  HelpCircle,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <Home size={18} />, path: "/" },
  { name: "Clients", icon: <Users size={18} />, path: "/clients" },
  { name: "Routers", icon: <Wifi size={18} />, path: "/routers" },
  { name: "Collectors", icon: <Database size={18} />, path: "/collectors" },
  { name: "Payments & Logs", icon: <Receipt size={18} />, path: "/payments-logs" },
  { name: "Reports", icon: <BarChart size={18} />, path: "/reports" },
  { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  { name: "Help & Support", icon: <LifeBuoy size={18} />, path: "/help-support" },
  { name: "FAQ", icon: <HelpCircle size={18} />, path: "/faq" },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white text-gray-800 flex flex-col border-r border-gray-200">
      <div className="px-6 py-4 text-xl font-bold">
        SmartISP Admin
      </div>
      <nav className="flex-1 px-6 py-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-sky-500 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
