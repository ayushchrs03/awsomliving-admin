import ChartCard from "../../../components/chartCard/index";
import PageHeader from "../../../components/pageHeader";
import { FiAlertTriangle } from "react-icons/fi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const ackResolvedTrend = [
  { date: "Week 1", acknowledged: 245, resolved: 220 },
  { date: "Week 2", acknowledged: 312, resolved: 285 },
  { date: "Week 3", acknowledged: 278, resolved: 256 },
  { date: "Week 4", acknowledged: 356, resolved: 332 },
  { date: "Week 5", acknowledged: 298, resolved: 275 },
  { date: "Week 6", acknowledged: 324, resolved: 310 },
];

const responseTimeData = [
  { range: "<5 min", count: 1840, color: "#22c55e" },
  { range: "5-15 min", count: 920, color: "#84cc16" },
  { range: "15-30 min", count: 420, color: "#f59e0b" },
  { range: "30-60 min", count: 180, color: "#f97316" },
  { range: ">60 min", count: 85, color: "#ef4444" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md border border-gray-200 rounded-lg px-3 py-2">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          Value: <span className="font-semibold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function AlertLogModule() {
  return (
    <div className="pt-4 sm:pt-6">
      <PageHeader
        title="Alert Log Analytics"
        subtitle="Operational tracking & audit trails"
      />

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-4 mt-3 mb-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100">
          <FiAlertTriangle className="h-5 w-5 text-red-600" />
        </div>

        <div>
          <p className="text-sm font-semibold text-red-700">
            12 Unacknowledged Alerts Older Than 30 Minutes
          </p>
          <p className="text-xs text-red-600 mt-1">
            These alerts require immediate attention from the operations team.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Acknowledged vs Resolved Trend" subtitle="Weekly comparison">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ackResolvedTrend}>
                {/* <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> */}
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />}/>

                <Line
                  type="monotone"
                  dataKey="acknowledged"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 5 }}
                  activeDot={{ r: 7, fill: "#1d4ed8" }}
                />

                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", r: 5 }}
                  activeDot={{ r: 7, fill: "#15803d" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Alert Response Time Distribution"
          subtitle="Time to acknowledge alerts"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData} barSize={60}>
                {/* <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> */}
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {responseTimeData.map((entry, index) => (
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
