interface StatusBadgeProps {
  status: "Online" | "Offline" | "Pending";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const color =
    status === "Online" ? "bg-green-100 text-green-800" :
    status === "Offline" ? "bg-red-100 text-red-800" :
    "bg-yellow-100 text-yellow-800";

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${color}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
