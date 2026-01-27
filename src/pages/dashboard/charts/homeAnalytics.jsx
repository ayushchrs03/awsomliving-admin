import ChartCard from "../../../components/chartCard/index";
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


const noResidentData = [
  { category: "New Users (<7 days)", count: 156, color: "#3b82f6" },
  { category: "Setup Incomplete", count: 89, color: "#f59e0b" },
  { category: "Churned Users", count: 42, color: "#53C5AC" },
];

export function HomeModule({
  homeGrowthData,
  activeInactiveData,
}) {
  return (
    <div className="pt-4 sm:pt-6">
         <PageHeader
        title="Home Analytics"
        subtitle="Operational coverage & risk visibility"

      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Homes Added Over Time"
          subtitle="Monthly home registrations"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={homeGrowthData}>
                {/* <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> */}
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", r: 5 }}
                  activeDot={{ r: 7, fill: "orange" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Active vs Inactive Homes"
          subtitle="Distribution by status"
        >
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeInactiveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {activeInactiveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Homes by Number of Residents"
        subtitle="Distribution of residents per home"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={noResidentData}>
              {/* <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> */}
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                 cursor={false} 
              />

              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {noResidentData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
