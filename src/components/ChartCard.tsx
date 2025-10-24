interface ChartCardProps {
  title: string;
}

export default function ChartCard({ title }: ChartCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-gray-700 font-semibold mb-3">{title}</h3>
      <div className="h-40 flex items-center justify-center text-gray-400">
        [Chart Placeholder]
      </div>
    </div>
  );
}
