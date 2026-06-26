"use client";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { day: "Mon", sales: 2400 },
  { day: "Tue", sales: 1800 },
  { day: "Wed", sales: 3200 },
  { day: "Thu", sales: 2800 },
  { day: "Fri", sales: 4100 },
  { day: "Sat", sales: 3600 },
  { day: "Sun", sales: 4800 },
];

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B8975A" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#B8975A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fontFamily: "Jost", fill: "#8C8270" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: "#FAF8F4",
            border: "1px solid #EDE0CE",
            borderRadius: "8px",
            fontFamily: "Jost",
            fontSize: "12px",
            color: "#1C1C1C",
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Sales"]}
        />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="#B8975A"
          strokeWidth={2}
          fill="url(#salesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
