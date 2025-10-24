import React, { useState } from "react";

// ============== Reusable Card Wrapper ==============
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${className || ""}`}
  >
    {children}
  </div>
);

// ============== Popup Card (Smaller Modal) ==============
const PopupCard: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white w-full max-w-lg max-h-[80vh] rounded-2xl shadow-2xl overflow-auto relative p-6 md:p-8">
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

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Active" | "Monthly" | "Performance">("Active");
  const [popup, setPopup] = useState<"pdf" | "excel" | null>(null);

  // ===== Dynamic Data =====
  const tabs = [
    { key: "Active", label: "Active vs Overdue vs Disconnected Accounts" },
    { key: "Monthly", label: "Monthly Collection Summary" },
    { key: "Performance", label: "Collector Performance" },
  ];

  const activeStats = [
    { value: "80%", label: "Active", color: "bg-sky-500" },
    { value: "15%", label: "Overdue", color: "bg-orange-500" },
    { value: "5%", label: "Disconnected", color: "bg-gray-300" },
  ];

  const monthlyData = [
    { month: "Jan", value: 80 },
    { month: "Feb", value: 60 },
    { month: "Mar", value: 90 },
    { month: "Apr", value: 70 },
    { month: "May", value: 85 },
    { month: "Jun", value: 95 },
    { month: "Jul", value: 100 },
  ];

  const collectors = [
    { name: "Susan Harper", amount: "$3,000", clients: 130, rating: 4.8 },
    { name: "Olivia Bennett", amount: "$3,500", clients: 110, rating: 4.7 },
    { name: "Noah Carter", amount: "$2,800", clients: 104, rating: 4.6 },
    { name: "Ava Mitchell", amount: "$2,500", clients: 90, rating: 4.1 },
    { name: "Liam Foster", amount: "$2,000", clients: 80, rating: 4.4 },
  ];

  // ===== Components =====
  const ReportBar: React.FC<{ value: string; label: string; color: string }> = ({
    value,
    label,
    color,
  }) => (
    <div className="flex flex-col items-start">
      <div className={`w-10 rounded-t-lg ${color} h-28`}></div>
      <span className="text-sm font-medium mt-2">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );

  const CollectionBar: React.FC<{ value: number; month: string }> = ({ value, month }) => (
    <div className="flex flex-col items-start h-44 justify-end">
      <div
        className="w-8 rounded-t-lg bg-sky-400 hover:bg-sky-600 transition-colors"
        style={{ height: `${value}%` }}
      ></div>
      <span className="text-xs text-gray-500 mt-2">{month}</span>
    </div>
  );

  const CollectorReportTable: React.FC = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Collector", "Collected Amount", "Clients Served", "Average Rating"].map(
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
          {collectors.map((c, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {c.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-600 font-medium">
                {c.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.clients}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 relative">
      <h2 className="text-4xl font-bold text-gray-900">Reports</h2>

      {/* Tabs */}
      <div className="flex flex-wrap space-x-1 p-1 bg-gray-100 rounded-xl max-w-fit shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-white shadow-md text-sky-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab */}
      {activeTab === "Active" && (
        <Card className="space-y-6">
          <h3 className="text-lg font-semibold text-sky-700">
            Active vs Overdue vs Disconnected Accounts
          </h3>
          <p className="text-4xl font-extrabold text-gray-800">
            100% <span className="text-sm text-emerald-500 font-medium">Total +0%</span>
          </p>
          <div className="flex justify-start gap-x-10 pt-6">
            {activeStats.map((stat, i) => (
              <ReportBar key={i} {...stat} />
            ))}
          </div>
        </Card>
      )}

      {/* Monthly Tab */}
      {activeTab === "Monthly" && (
        <Card className="space-y-6">
          <h3 className="text-lg font-semibold text-sky-700">Monthly Collection Summary</h3>
          <p className="text-sm text-gray-500">
            This Month: <span className="text-xl font-bold text-sky-600">$12,500</span>
          </p>
          <div className="flex items-end overflow-x-auto gap-x-4 px-2 justify-start h-48">
            {monthlyData.map((m, i) => (
              <CollectionBar key={i} {...m} />
            ))}
          </div>
        </Card>
      )}

      {/* Performance Tab */}
      {activeTab === "Performance" && (
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Collector Performance</h3>
          <CollectorReportTable />
        </Card>
      )}

      {/* Export Buttons */}
      <div className="flex flex-wrap justify-start space-x-4 pt-6">
        {[
          { type: "pdf", label: "Export as PDF", color: "bg-sky-600", hover: "hover:bg-sky-700" },
          { type: "excel", label: "Export as Excel", color: "bg-emerald-600", hover: "hover:bg-emerald-700" },
        ].map((btn) => (
          <button
            key={btn.type}
            onClick={() => setPopup(btn.type as any)}
            className={`px-4 py-2 text-white text-sm font-medium rounded-lg ${btn.color} ${btn.hover} transition`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Popup Modals */}
      {popup && (
        <PopupCard title={`Export as ${popup.toUpperCase()}`} onClose={() => setPopup(null)}>
          <p className="text-gray-600 mb-4">
            {popup === "pdf"
              ? "Choose what to include in the PDF export:"
              : "Select the data you want to include in the Excel file:"}
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            {popup === "pdf" ? (
              <>
                <li>• Summary of accounts</li>
                <li>• Monthly and performance stats</li>
                <li>• Collector rankings</li>
              </>
            ) : (
              <>
                <li>• Monthly collection data</li>
                <li>• Performance breakdown</li>
                <li>• Collector details</li>
              </>
            )}
          </ul>
          <button
            onClick={() => setPopup(null)}
            className={`w-full mt-4 py-2 text-white rounded-lg ${
              popup === "pdf" ? "bg-sky-600 hover:bg-sky-700" : "bg-emerald-600 hover:bg-emerald-700"
            } transition`}
          >
            Confirm Export
          </button>
        </PopupCard>
      )}
    </div>
  );
};

export default ReportsPage;
