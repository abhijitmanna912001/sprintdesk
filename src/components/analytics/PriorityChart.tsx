import {
  Bar,
  BarChart,
  CartesianGrid,
  DefaultTooltipContent,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { getPriorityBreakdown } from "../../lib/analytics";
import type { Task } from "../../types";

interface PriorityChartProps {
  tasks: Task[];
}

export function PriorityChart({ tasks }: Readonly<PriorityChartProps>) {
  const data = getPriorityBreakdown(tasks);

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Priority Breakdown</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <DefaultTooltipContent />
          <Legend />
          <Bar dataKey="low" stackId="priority" fill="#16a34a" />
          <Bar dataKey="medium" stackId="priority" fill="#ca8a04" />
          <Bar
            dataKey="high"
            stackId="priority"
            fill="#dc2626"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
