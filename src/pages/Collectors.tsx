import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Minimal local useToast hook fallback
const useToast = () => {
  const toast = (opts: { title: string; description?: string; variant?: string }) => {
    if (opts.variant === "destructive") {
      console.error("[toast][destructive]", opts.title, opts.description ?? "");
    } else {
      console.log("[toast]", opts.title, opts.description ?? "");
    }
  };
  return { toast };
};

// ============= Default Marker Icon =============
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// ============= Reusable Card =============
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

// ============= PopupCard =============
const PopupCard: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
      >
        ✕
      </button>
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  </div>
);

// ============= ProgressBar =============
const ProgressBar: React.FC<{ score: number }> = ({ score }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className="h-2 rounded-full bg-sky-600" style={{ width: `${score}%` }} />
  </div>
);

// ============= Collector Interface =============
interface Collector {
  name: string;
  town: string;
  activeClients: number;
  lastCollectionDate: string;
  performanceScore: number;
  coords: { lat: number; lng: number };
  password?: string;
}

// ============= Collectors Page =============
const CollectorsPage: React.FC = () => {
  const [view, setView] = useState<"list" | "map">("list");
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });

  const [form, setForm] = useState({
    name: "",
    town: "",
    activeClients: "",
    lastCollectionDate: "",
    performanceScore: "",
    lat: "",
    lng: "",
    password: "",
    confirmPassword: "",
  });

  const fetchCollectors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/collectors");
      if (!response.ok) throw new Error("Failed to fetch collectors");
      const data = await response.json();
      setCollectors(data);
    } catch (error) {
      console.error("Error loading collectors:", error);
      toast({
        title: "Error",
        description: "Failed to load collectors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const handleAddCollector = async (e: React.FormEvent) => {
  e.preventDefault();
  const { name, town, activeClients, lastCollectionDate, performanceScore, lat, lng, password, confirmPassword } = form;

  // ✅ Check all fields
  if (!name || !town || !activeClients || !lastCollectionDate || !performanceScore || !lat || !lng || !password || !confirmPassword) {
    toast({
      title: "Validation Error",
      description: "Please fill in all fields!",
      variant: "destructive",
    });
    return;
  }

  // ✅ Check password match
  if (password !== confirmPassword) {
    toast({
      title: "Password Mismatch",
      description: "Password does not match",
      variant: "destructive",
    });
    return;
  }

  const newCollector = {
    name,
    town,
    activeClients: parseInt(activeClients),
    lastCollectionDate,
    performanceScore: parseInt(performanceScore),
    coords: { lat: parseFloat(lat), lng: parseFloat(lng) },
    password,
  };

  try {
    const response = await fetch("/api/collectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCollector),
    });

    if (!response.ok) throw new Error("Failed to add collector");

    // ✅ Success toast
    toast({
      title: "Success",
      description: "Collector added successfully!",
    });

    // Refresh and reset
    await fetchCollectors();
    setShowPopup(false);
    setForm({
      name: "",
      town: "",
      activeClients: "",
      lastCollectionDate: "",
      performanceScore: "",
      lat: "",
      lng: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword({ password: false, confirmPassword: false });
  } catch (error) {
    console.error("Error adding collector:", error);
    toast({
      title: "Error",
      description: "Failed to add collector",
      variant: "destructive",
    });
  }
};


  const renderPasswordField = (
    key: "password" | "confirmPassword",
    placeholder: string
  ) => (
    <div className="relative">
      <input
        type={showPassword[key] ? "text" : "password"}
        placeholder={placeholder}
        value={(form as any)[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10"
      />
      <span
        className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
        onClick={() => setShowPassword({ ...showPassword, [key]: !showPassword[key] })}
      >
        {showPassword[key] ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold text-gray-900">Collectors</h2>
        <button
          onClick={() => setShowPopup(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-xl shadow-md hover:bg-sky-700 transition"
        >
          Add Collector
        </button>
      </div>

      <div className="flex space-x-4 border-b pb-2">
        {["list", "map"].map((mode) => (
          <button
            key={mode}
            onClick={() => setView(mode as "list" | "map")}
            className={`pb-2 transition-all ${
              view === mode
                ? "font-semibold text-sky-600 border-b-2 border-sky-600"
                : "text-gray-500 hover:text-sky-600"
            }`}
          >
            {mode === "list" ? "List View" : "Map View"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading collectors...</div>
      ) : (
        <>
          {view === "list" ? (
            <Card className="overflow-x-auto p-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Collector Name", "Assigned Town", "Active Clients", "Last Collection Date", "Performance Score"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collectors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-8">
                        No collectors found.
                      </td>
                    </tr>
                  ) : (
                    collectors.map((c, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-sky-600">{c.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{c.town}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{c.activeClients}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{c.lastCollectionDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 w-48">
                          <ProgressBar score={c.performanceScore} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          ) : (
            <Card className="p-0">
              <MapContainer
                center={[14.5995, 120.9842]}
                zoom={11}
                style={{ height: "500px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {collectors.map((c, idx) => (
                  <Marker key={idx} position={[c.coords.lat, c.coords.lng]}>
                    <Popup>
                      <div className="text-sm space-y-1">
                        <p><strong>{c.name}</strong></p>
                        <p>Town: {c.town}</p>
                        <p>Active Clients: {c.activeClients}</p>
                        <p>Last Collection: {c.lastCollectionDate}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Card>
          )}
        </>
      )}

      {showPopup && (
        <PopupCard title="Add New Collector" onClose={() => setShowPopup(false)}>
          <form onSubmit={handleAddCollector} className="space-y-3">
            <input
              type="text"
              placeholder="Collector Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />

            {renderPasswordField("password", "Collector Password")}
            {renderPasswordField("confirmPassword", "Confirm Password")}

            <input
              type="text"
              placeholder="Assigned Town"
              value={form.town}
              onChange={(e) => setForm({ ...form, town: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Active Clients"
              value={form.activeClients}
              onChange={(e) => setForm({ ...form, activeClients: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="date"
              placeholder="Last Collection Date"
              value={form.lastCollectionDate}
              onChange={(e) => setForm({ ...form, lastCollectionDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Performance Score (0–100)"
              value={form.performanceScore}
              onChange={(e) => setForm({ ...form, performanceScore: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />

            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
            >
              Add Collector
            </button>
          </form>
        </PopupCard>
      )}
    </div>
  );
};

export default CollectorsPage;
