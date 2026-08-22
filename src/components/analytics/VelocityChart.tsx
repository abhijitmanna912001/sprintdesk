import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getSprintVelocity } from "../../lib/analytics";
import type { Sprint, Task } from "../../types";

interface VelocityChartProps {
  tasks: Task[];
  sprints: Sprint[];
}

export function VelocityChart({
  tasks,
  sprints,
}: Readonly<VelocityChartProps>) {
  const data = getSprintVelocity(tasks, sprints);

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Sprint Velocity</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sprintName" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="completed" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
