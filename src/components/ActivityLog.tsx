const logs = [
  { text: "User 'Alex' logged in", time: "2 hours ago" },
  { text: "Router 'Router001' updated", time: "3 hours ago" },
  { text: "Payment received from 'Client001'", time: "5 hours ago" },
  { text: "Collector 'Collector001' reported", time: "8 hours ago" },
  { text: "System maintenance completed", time: "1 day ago" },
];

export default function ActivityLog() {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-gray-700 font-semibold mb-3">Recent Activities Logs</h3>
      <ul className="space-y-3">
        {logs.map((log, idx) => (
          <li key={idx} className="text-gray-600">
            <span className="block">{log.text}</span>
            <span className="text-xs text-gray-400">{log.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
