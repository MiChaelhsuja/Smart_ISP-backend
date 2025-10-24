import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { User, Router, DollarSign, ClipboardList } from "lucide-react";

interface Client {
  name: string;
  town: string;
  plan: string;
  paymentStatus: string;
  routerStatus: string;
  lastPaymentDate: string;
  serial: string;
}

interface DashboardStats {
  activeUsers: number;
  overdueAccounts: number;
  disconnectedAccounts: number;
  totalClients: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface ActivityLog {
  icon: string;
  message: string;
  time: string;
}

const iconMap: Record<string, any> = {
  User,
  Router,
  DollarSign,
  ClipboardList,
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeUsers: 0,
    overdueAccounts: 0,
    disconnectedAccounts: 0,
    totalClients: 0,
  });
  const [activeDevicesData, setActiveDevicesData] = useState<ChartData[]>([]);
  const [collectionsData, setCollectionsData] = useState<ChartData[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch clients from backend
        const clientsResponse = await fetch("/api/subscribers");
        if (!clientsResponse.ok) throw new Error("Failed to load clients");
        const clients: Client[] = await clientsResponse.json();

        // Calculate stats from client data
        const activeUsers = clients.filter(c => c.routerStatus === "Online").length;
        const overdueAccounts = clients.filter(c => c.paymentStatus === "Pending").length;
        const disconnectedAccounts = clients.filter(c => c.routerStatus === "Offline").length;

        setStats({
          activeUsers,
          overdueAccounts,
          disconnectedAccounts,
          totalClients: clients.length,
        });

        // Load dashboard data
        const dashboardResponse = await fetch("/Data/dashboard.json");
        if (dashboardResponse.ok) {
          const data = await dashboardResponse.json();
          setActiveDevicesData(data.activeDevicesData || []);
          setCollectionsData(data.collectionsData || []);
          setActivityLogs(data.activityLogs || []);
        }
      } catch (err: any) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6 font-sans min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Users", value: stats.activeUsers },
          { label: "Overdue Accounts", value: stats.overdueAccounts },
          { label: "Disconnected Accounts", value: stats.disconnectedAccounts },
          { label: "Total Clients", value: stats.totalClients },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg p-6 text-center shadow-md border border-gray-200"
          >
            <p className="text-gray-700">{item.label}</p>
            <h2 className="text-2xl font-bold text-gray-900">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Active Devices Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activeDevicesData}>
              <defs>
                <linearGradient id="colorDevices" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDevices)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Weekly Collections
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={collectionsData}>
              <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
              <Tooltip />
              <defs>
                <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="value"
                fill="url(#colorCollections)"
                radius={[8, 8, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Logs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity Logs
        </h3>
        <ul className="relative ml-10">
          {activityLogs.map((log, idx) => {
            const Icon = iconMap[log.icon] || User;
            return (
              <li key={idx} className="relative pb-8">
                {idx !== activityLogs.length - 1 && (
                  <div className="absolute left-5 top-4 bottom-0 w-px border-l border-dashed border-gray-300"></div>
                )}
                <span className="absolute left-2.5 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-white text-gray-800">
                  <Icon size={18} />
                </span>
                <div className="ml-16">
                  <p className="text-gray-900 text-sm">{log.message}</p>
                  <span className="text-sky-600 text-xs">{log.time}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
