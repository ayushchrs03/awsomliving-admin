import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../../../components/chartCard";

function UserFunnelPage({ data = [] }) {
  return (
    <ChartCard
      title="User Funnel Drop-off"
      subtitle="Conversion through key platform stages"
    >
      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              dataKey="label"
              type="category"
              width={140}
              tick={{ fontSize: 13, fill: "#475569" }}
            />

            <Bar
              dataKey="percent"
              fill="#F09F33"
              radius={[0, 6, 6, 0]}
              label={(props) => {
                const { x, y, width, height, index } = props;
                const item = data[index] || {};

                return (
                  <g>
                    <text
                      x={x + 12}
                      y={y + height / 2 + 4}
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {(item.value ?? 0).toLocaleString()}
                    </text>

                    <text
                      x={x + width + 12}
                      y={y + height / 2 + 4}
                      fill="#0f172a"
                      fontSize="12"
                      fontWeight="600"
                      textAnchor="start"
                    >
                      {Number(item.percent ?? 0).toFixed(2)}%
      {item.drop ? ` ↓${Number(item.drop).toFixed(2)}%` : ""}
                    </text>
                  </g>
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export default UserFunnelPage;
