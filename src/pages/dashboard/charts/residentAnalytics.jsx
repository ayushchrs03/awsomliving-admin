import ChartCard from "../../../components/chartCard";
import PageHeader from "../../../components/pageHeader";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const residentPerHomeData = [
  { range: "1", count: 820, color: "#3b82f6" },
  { range: "2", count: 645, color: "#22c55e" },
  { range: "3", count: 312, color: "#f59e0b" },
  { range: "4", count: 120, color: "#a855f7" },
  { range: "5+", count: 59, color: "#ef4444" },
];

const ageGroupData = [
  { age: "60-65", count: 420, color: "#0ea5e9" },
  { age: "66-70", count: 580, color: "#22c55e" },
  { age: "71-75", count: 720, color: "#6366f1" },
  { age: "76-80", count: 540, color: "#f97316" },
  { age: "81-85", count: 380, color: "#a855f7" },
  { age: "86+", count: 210, color: "#ef4444" },
];

const noActivityData = [
  { category: "0-24 hrs", count: 45, color: "#22c55e" },
  { category: "24-48 hrs", count: 23, color: "#f59e0b" },
  { category: "48+ hrs", count: 12, color: "#ef4444" },
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

export function ResidentModule() {
  return (
    <div className="pt-4 sm:pt-6">
      <PageHeader
        title="Resident Analytics"
        subtitle="Monitoring coverage & activity visibility"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Residents per Home Distribution"
          subtitle="Number of residents in each home"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={residentPerHomeData} barSize={80}>
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={false}  />

                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {residentPerHomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Residents by Age Group"
          subtitle="Age distribution of monitored residents"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupData} barSize={60}>
                <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={false}  />

                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {ageGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard
          title="Residents with No Activity Data"
          subtitle="Time since last activity detected"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={noActivityData} layout="vertical" barSize={60}>
                {/* <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> */}
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={90}
                />

                <Tooltip content={<CustomTooltip />} cursor={false} />

                <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                  {noActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
