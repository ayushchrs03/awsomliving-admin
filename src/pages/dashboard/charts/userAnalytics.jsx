import ChartCard from "../../../components/chartCard";
import {
  LineChart,
  Line,
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
import PageHeader from "../../../components/pageHeader";

export function UserModule({
  userGrowthData = [],
  activeInactiveData = [],
  noResidentData = [],
}) {
  const pieData = activeInactiveData.map((item) => ({
    ...item,
    color: item.name === "Active" ? "#22c55e" : "#f97316",
  }));

  const barData = noResidentData.map((item, index) => ({
    ...item,
    color: ["#3b82f6", "#f59e0b", "#53C5AC"][index % 3],
  }));

  console.log("User Growth Data:", userGrowthData);

  return (
    <div className="pt-4 sm:pt-6">
         <PageHeader
        title="User Analytics"
        subtitle="Platform adoption & access control metrics"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="User Growth Over Time"
          subtitle="Monthly new user registrations"
        >
          <div className="h-72">
            {userGrowthData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                No growth data available
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard
          title="Active vs Inactive Users"
          subtitle="Distribution by activity status"
        >
          <div className="h-72">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                No activity data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Users with No Assigned Resident"
        subtitle="Breakdown by user category"
      >
        <div className="h-64">
          {barData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              No category data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={false} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
