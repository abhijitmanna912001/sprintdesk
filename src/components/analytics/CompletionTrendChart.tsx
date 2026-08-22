import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCompletionTrend } from "../../lib/analytics";
import type { Task } from "../../types";

interface CompletionTrendChartProps {
  tasks: Task[];
}

export function CompletionTrendChart({
  tasks,
}: Readonly<CompletionTrendChartProps>) {
  const data = getCompletionTrend(tasks);

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Completion Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
