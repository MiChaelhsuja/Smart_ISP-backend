import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, className }) => {
  return (
    <div
      className={`p-4 rounded-lg text-center ${className ?? "bg-white"} `}
    >
      <h4 className="text-gray-600 text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default MetricCard;
