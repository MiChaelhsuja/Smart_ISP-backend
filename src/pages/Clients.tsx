import React, { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

// ================= Section Title =================
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-4xl font-bold text-gray-900 mb-6">{children}</h2>
);

// ================= Status Badge =================
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let color = "bg-gray-100 text-gray-800";
  if (status === "Paid" || status === "Online") color = "bg-green-100 text-green-800";
  if (status === "Pending" || status === "Offline") color = "bg-red-100 text-red-800";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
};

// ================= Popup Card =================
const PopupCard: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
      >
        ✕
      </button>
      <h2 className="text-4xl font-bold mb-6 text-sky-700">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  </div>
);

// ================= Client Interface =================
interface Client {
  id?: number;
  name: string;
  town: string;
  plan: string;
  serial: string;
  paymentStatus: string;
  routerStatus: string;
  lastPaymentDate: string;
  phone?: string; // <-- added phone
  active?: boolean;
}

// ================= Clients Page =================
const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    paymentStatus: "",
    routerStatus: "",
    plan: "",
  });
  const [popupOpen, setPopupOpen] = useState(false);
  const [newClient, setNewClient] = useState<Client>({
    name: "",
    town: "",
    plan: "Basic",
    serial: "",
    paymentStatus: "Pending",
    routerStatus: "Offline",
    lastPaymentDate: "",
    phone: "",
  });

  // Fetch clients from backend
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscribers");
      if (!response.ok) throw new Error("Failed to load client data");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filtered clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.town && c.town.toLowerCase().includes(search.toLowerCase())) ||
        (c.plan && c.plan.toLowerCase().includes(search.toLowerCase())) ||
        (c.serial && c.serial.toLowerCase().includes(search.toLowerCase())) ||
        (c.phone && c.phone.toLowerCase().includes(search.toLowerCase()));

      const matchesPayment =
        !filters.paymentStatus || c.paymentStatus === filters.paymentStatus;
      const matchesRouter =
        !filters.routerStatus || c.routerStatus === filters.routerStatus;
      const matchesPlan = !filters.plan || c.plan === filters.plan;

      return matchesSearch && matchesPayment && matchesRouter && matchesPlan;
    });
  }, [search, filters, clients]);

  // Add new client - POST to backend
  const handleAddClient = async () => {
    if (!newClient.name.trim()) return toast.error("Name is required");
    if (!newClient.serial.trim()) return toast.error("Serial number is required");

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) throw new Error("Failed to add client");

      toast.success("Client added successfully!");
      await fetchClients();
      setPopupOpen(false);
      setNewClient({
        name: "",
        town: "",
        plan: "Basic",
        serial: "",
        paymentStatus: "Pending",
        routerStatus: "Offline",
        lastPaymentDate: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Failed to add client to server");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <SectionTitle>Clients</SectionTitle>
        <button
          onClick={() => setPopupOpen(true)}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition"
        >
          Add Client
        </button>
      </div>

      {/* Search + Filters Inline */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
          />
        </div>

        <select
          value={filters.paymentStatus}
          onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-sky-400 focus:border-sky-400 text-sm"
        >
          <option value="">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <select
          value={filters.routerStatus}
          onChange={(e) => setFilters({ ...filters, routerStatus: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-sky-400 focus:border-sky-400 text-sm"
        >
          <option value="">All Routers</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        <select
          value={filters.plan}
          onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-sky-400 focus:border-sky-400 text-sm"
        >
          <option value="">All Plans</option>
          <option value="Basic">Basic</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && <div className="text-center text-gray-500 py-10">Loading clients...</div>}

      {/* Clients Table */}
      {!loading && (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Phone", "Serial", "Town", "Plan", "Payment", "Router", "Last Payment"].map(
                  (header) => (
                    <th key={header} className="px-6 py-3 text-left font-semibold text-gray-700">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-8">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client, index) => (
                  <tr key={client.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{client.name}</td>
                    <td className="px-6 py-3 text-gray-700">{client.phone || "—"}</td>
                    <td className="px-6 py-3 text-gray-700">{client.serial}</td>
                    <td className="px-6 py-3 text-gray-700">{client.town}</td>
                    <td className="px-6 py-3 text-gray-700">{client.plan}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={client.paymentStatus} />
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={client.routerStatus} />
                    </td>
                    <td className="px-6 py-3 text-gray-700">{client.lastPaymentDate || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Client Popup */}
      {popupOpen && (
        <PopupCard title="Add New Client" onClose={() => setPopupOpen(false)}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name *"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-sky-400 focus:border-sky-400"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newClient.phone || ""}
              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-sky-400 focus:border-sky-400"
            />
            <input
              type="text"
              placeholder="Serial Number *"
              value={newClient.serial}
              onChange={(e) => setNewClient({ ...newClient, serial: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-sky-400 focus:border-sky-400"
              required
            />
            <input
              type="text"
              placeholder="Town"
              value={newClient.town}
              onChange={(e) => setNewClient({ ...newClient, town: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-sky-400 focus:border-sky-400"
            />
            <select
              value={newClient.plan}
              onChange={(e) => setNewClient({ ...newClient, plan: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-sky-400 focus:border-sky-400"
            >
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
            <select
              value={newClient.paymentStatus}
              onChange={(e) => setNewClient({ ...newClient, paymentStatus: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-sky-400 focus:border-sky-400"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <select
              value={newClient.routerStatus}
              onChange={(e) => setNewClient({ ...newClient, routerStatus: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-sky-400 focus:border-sky-400"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            <input
              type="date"
              value={newClient.lastPaymentDate}
              onChange={(e) => setNewClient({ ...newClient, lastPaymentDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-sky-400 focus:border-sky-400"
            />

            <button
              onClick={handleAddClient}
              className="w-full py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
            >
              Add Client
            </button>
          </div>
        </PopupCard>
      )}
    </div>
  );
};

export default ClientsPage;
