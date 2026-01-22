import ChartCard from "../../../components/chartCard/index";
import PageHeader from "../../../components/pageHeader";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";



const syncDistribution = [
  { range: "<1 hr", count: 2100, color: "#3b82f6" },
  { range: "1-6 hrs", count: 820, color: "#22c55e" },
  { range: "6-12 hrs", count: 340, color: "#f59e0b" },
  { range: "12-24 hrs", count: 156, color: "#a855f7" },
  { range: ">24 hrs", count: 116, color: "#ef4444" },
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

export function DeviceModule({ onlineOfflineData = [] }) {
  return (
    <div className="pt-4 sm:pt-6">
      <PageHeader
        title="Device Analytics"
        subtitle="Reliability & vendor performance metrics"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Online vs Offline Devices"
          subtitle="Current device status distribution"
        >
          <div className="h-72 flex items-center justify-center">
          {onlineOfflineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={onlineOfflineData}
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
                  {onlineOfflineData.map((entry, index) => (
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
             ) : (
               <p className="text-sm text-gray-400">Loading device status...</p>
             )}
          </div>
        </ChartCard>

        <ChartCard
          title="Last Sync Time Distribution"
          subtitle="Time since last device sync"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={syncDistribution} barSize={80}>
                {/* <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> */}
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />

                <Tooltip content={<CustomTooltip />} cursor={false} />

                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {syncDistribution.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
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
