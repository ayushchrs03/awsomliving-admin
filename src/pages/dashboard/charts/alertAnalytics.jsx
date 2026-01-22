import ChartCard from "../../../components/chartCard/index";
import PageHeader from "../../../components/pageHeader";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const rulesByType = [
  { type: "Fall Detection", count: 1240, color: "#3b82f6" },
  { type: "Inactivity", count: 980, color: "#22c55e" },
  { type: "Abnormal Patterns", count: 640, color: "#f59e0b" },
  { type: "Door/Entry", count: 420, color: "#a855f7" },
  { type: "Temperature", count: 280, color: "#ef4444" },
];

const rulesByStatus = [
  { name: "Active", value: 2840, color: "#22c55e" },
  { name: "Disabled", value: 720, color: "orange" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md border border-gray-200 rounded-lg px-3 py-2">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          Count: <span className="font-semibold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function AlertModule() {
  return (
    <div className="pt-4 sm:pt-6">
      <PageHeader
        title="Alert Configuration"
        subtitle="Rules configuration & coverage analysis"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Alert Rules by Type"
          subtitle="Distribution across rule categories"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rulesByType} barSize={60}>

                <XAxis
                  dataKey="type"
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fontSize: 12 }} />

                <Tooltip content={<CustomTooltip />} cursor={false}/>

                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {rulesByType.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Alert Rules by Status" subtitle="Active vs Disabled rules">
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rulesByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={105}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {rulesByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
