import React, { useState } from "react";
import { RefreshCcw, UserPlus, DollarSign, FileText, X } from "lucide-react";

// Status badge
const StatusBadge: React.FC<{ status: "Paid" | "Pending" | "Failed" }> = ({ status }) => {
  const colors = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
};

// Mock Data (payments)
const PAYMENT_DATA = [
  { client: "Client A", amount: 50, mode: "Cash", date: "Oct 1, 2023", collector: "Collector 1", status: "Paid" as const },
  { client: "Client B", amount: 75, mode: "GCash", date: "Oct 2, 2023", collector: "Collector 2", status: "Paid" as const },
  { client: "Client C", amount: 60, mode: "Cash", date: "Oct 3, 2023", collector: "Collector 1", status: "Paid" as const },
  { client: "Client D", amount: 80, mode: "GCash", date: "Oct 4, 2023", collector: "Collector 2", status: "Paid" as const },
  { client: "Client E", amount: 55, mode: "Cash", date: "Oct 5, 2023", collector: "Collector 1", status: "Paid" as const },
];

// Mock Data (disconnection)
const DISCONNECTION_DATA = [
  { client: "Client F", reason: "Unpaid bills", date: "Oct 1, 2023" },
  { client: "Client G", reason: "Account expired", date: "Oct 2, 2023" },
  { client: "Client H", reason: "Violation of terms", date: "Oct 3, 2023" },
];

// Mock Data (audit logs)
const ACTIVITY_LOGS = [
  { icon: RefreshCcw, text: "Router rebooted by Collector Alex", amount: undefined, time: "Sept 29, 10:22 AM" },
  { icon: DollarSign, text: "Payment logged by Sarah", amount: "$50.00", time: "Sept 30, 1:15 PM" },
  { icon: FileText, text: "Client account updated by Admin (ID: #12345)", amount: undefined, time: "Oct 1, 9:00 AM" },
  { icon: UserPlus, text: "New client registered by Admin", amount: undefined, time: "Oct 2, 2:30 PM" },
  { icon: DollarSign, text: "Payment logged by Mark", amount: "$75.00", time: "Oct 3, 11:45 AM" },
];

const PaymentsLogsPage: React.FC = () => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [showDisconnection, setShowDisconnection] = useState(false);

  const totalAmount = PAYMENT_DATA.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-8">
      {/* Page Title */}
      <h2 className="text-4xl font-bold text-gray-800">Payments & Logs</h2>

      {/* Payment Records Table */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Payment Records Table</h3>
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Client", "Amount", "Mode", "Date", "Collector", "Status"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {PAYMENT_DATA.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{payment.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">${payment.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{payment.mode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{payment.collector}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={payment.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Audit Logs</h3>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <ul className="relative ml-10">
            {ACTIVITY_LOGS.map((log, idx) => {
              const Icon = log.icon;
              return (
                <li key={idx} className="relative pb-8">
                  {idx !== ACTIVITY_LOGS.length - 1 && (
                    <div className="absolute left-5 top-4 bottom-0 w-px border-l border-dashed border-gray-300"></div>
                  )}

                  <span className="absolute left-2.5 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-white">
                    <Icon className="w-5 h-5 text-black" />
                  </span>

                  <div className="ml-16">
                    <p className="text-gray-800 text-sm">
                      {log.text}
                      {log.amount && (
                        <span className="ml-2 font-medium text-green-700">({log.amount})</span>
                      )}
                    </p>
                    <span className="text-sky-600 text-xs">{log.time}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setShowReceipt(true)}
          className="px-5 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          Export Receipts
        </button>

        <button
          onClick={() => setShowDisconnection(true)}
          className="px-5 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          Export Disconnection Notices
        </button>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <ReceiptModal data={PAYMENT_DATA} total={totalAmount} onClose={() => setShowReceipt(false)} />
      )}

      {/* Disconnection Modal */}
      {showDisconnection && (
        <DisconnectionModal data={DISCONNECTION_DATA} onClose={() => setShowDisconnection(false)} />
      )}
    </div>
  );
};

// --- Receipt Modal Component ---
const ReceiptModal: React.FC<{ data: typeof PAYMENT_DATA; total: number; onClose: () => void }> = ({ data, total, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X className="w-6 h-6" />
      </button>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Receipt Summary</h3>
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Client</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Mode</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Date</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-800">{p.client}</td>
                <td className="px-4 py-3 text-gray-600">{p.mode}</td>
                <td className="px-4 py-3 text-gray-600">{p.date}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">${p.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold text-gray-900 text-lg">
              <td colSpan={3} className="px-4 py-4 text-right">Total</td>
              <td className="px-4 py-4 text-right">${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Close
        </button>
        <button onClick={() => alert("Exporting receipt PDF...")} className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Export Receipt
        </button>
      </div>
    </div>
  </div>
);

// --- Disconnection Modal Component ---
const DisconnectionModal: React.FC<{ data: typeof DISCONNECTION_DATA; onClose: () => void }> = ({ data, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X className="w-6 h-6" />
      </button>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Disconnection Notices</h3>
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Client</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Reason</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-800">{d.client}</td>
                <td className="px-4 py-3 text-gray-600">{d.reason}</td>
                <td className="px-4 py-3 text-gray-600">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Close
        </button>
        <button onClick={() => alert("Exporting disconnection notices...")} className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Export Notices
        </button>
      </div>
    </div>
  </div>
);

export default PaymentsLogsPage;
