import React, { useState } from "react";
import { Search } from "lucide-react";

// ================== StatusBadge ==================
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let color = "bg-gray-100 text-gray-800";
  if (status === "Active") color = "bg-sky-100 text-sky-800";
  else if (status === "Offline") color = "bg-red-100 text-red-800";
  else if (status === "Maintenance") color = "bg-yellow-100 text-yellow-800";

  return (
    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${color}`}>
      {status}
    </span>
  );
};

// ================== PopupCard (Small Modal) ==================
const PopupCard: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md max-h-[60vh] rounded-2xl shadow-2xl overflow-auto relative p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
        >
          ✕
        </button>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-sky-700">{title}</h2>
        <div className="space-y-4 md:space-y-6">{children}</div>
      </div>
    </div>
  );
};

// ================== Router Interface ==================
interface Router {
  id: string;
  client: string;
  status: "Active" | "Offline" | "Maintenance";
  uptime: string;
  signalStrength: string;
  location: "North" | "South";
}

// ================== RoutersPage ==================
const RoutersPage: React.FC = () => {
  const [routers, setRouters] = useState<Router[]>([
    {
      id: "R001",
      client: "John Doe",
      status: "Active",
      uptime: "12h 30m",
      signalStrength: "-65 dBm",
      location: "North",
    },
    {
      id: "R002",
      client: "Jane Smith",
      status: "Offline",
      uptime: "0h",
      signalStrength: "N/A",
      location: "South",
    },
    {
      id: "R003",
      client: "Acme Corp",
      status: "Maintenance",
      uptime: "2h 15m",
      signalStrength: "-72 dBm",
      location: "North",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "", location: "" });
  const [popup, setPopup] = useState<null | { action: "Reboot" | "Config" | "Logs"; router: Router }>(null);

  // ================== Filtering Logic ==================
  const filteredRouters = routers.filter((router) => {
    const matchesSearch =
      router.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      router.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === "" || router.status === filters.status;
    const matchesLocation = filters.location === "" || router.location === filters.location;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // ================== Actions ==================
  const handleReboot = (router: Router) => {
    setRouters((prev) =>
      prev.map((r) =>
        r.id === router.id ? { ...r, status: "Offline", uptime: "0h" } : r
      )
    );
    setPopup(null);
    alert(`Router ${router.id} is rebooting...`);
  };

  const handleConfig = (router: Router) => {
    alert(`Opening configuration for ${router.id} (${router.client})...`);
    setPopup(null);
  };

  const handleLogs = (router: Router) => {
    alert(`Fetching logs for ${router.id} (${router.client})...`);
    setPopup(null);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900">Routers</h1>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or Client Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Offline">Offline</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-sky-500 focus:border-sky-500 text-sm"
          >
            <option value="">All Locations</option>
            <option value="North">North</option>
            <option value="South">South</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-sky-50">
            <tr>
              {["Router ID", "Client", "Status", "Uptime", "Signal Strength", "Actions"].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRouters.map((router, index) => (
              <tr key={index} className="hover:bg-sky-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{router.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{router.client}</td>
                <td className="px-6 py-4"><StatusBadge status={router.status} /></td>
                <td className="px-6 py-4 text-sm text-gray-500">{router.uptime}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{router.signalStrength}</td>
                <td className="px-6 py-4 text-sm font-medium space-x-3">
                  <button onClick={() => setPopup({ action: "Reboot", router })} className="text-sky-600 hover:text-sky-800">Reboot</button>
                  <button onClick={() => setPopup({ action: "Config", router })} className="text-sky-600 hover:text-sky-800">Config</button>
                  <button onClick={() => setPopup({ action: "Logs", router })} className="text-sky-600 hover:text-sky-800">Logs</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================== Popup ================== */}
      {popup && (
        <PopupCard title={`${popup.action} Router ${popup.router.id}`} onClose={() => setPopup(null)}>
          {popup.action === "Reboot" && (
            <>
              <p className="text-gray-600">Are you sure you want to reboot this router?</p>
              <button
                onClick={() => handleReboot(popup.router)}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Confirm Reboot
              </button>
            </>
          )}
          {popup.action === "Config" && (
            <>
              <p className="text-gray-600">Simulated router configuration access.</p>
              <button
                onClick={() => handleConfig(popup.router)}
                className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Open Config
              </button>
            </>
          )}
          {popup.action === "Logs" && (
            <>
              <p className="text-gray-600">Viewing logs for router <b>{popup.router.id}</b>.</p>
              <button
                onClick={() => handleLogs(popup.router)}
                className="w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Fetch Logs
              </button>
            </>
          )}
        </PopupCard>
      )}
    </div>
  );
};

export default RoutersPage;
