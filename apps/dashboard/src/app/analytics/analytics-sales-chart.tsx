"use client";

import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const salesData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 19000 },
  { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 22000 },
  { month: "May", revenue: 28000 },
  { month: "Jun", revenue: 24000 },
  { month: "Jul", revenue: 31000 },
];

const topProducts = [
  { name: "Prayer Rug", pct: 92 },
  { name: "Abaya Set", pct: 84 },
  { name: "Quran Stand", pct: 76 },
  { name: "Miswak Kit", pct: 68 },
  { name: "Tasbih Beads", pct: 61 },
];

const categoryData = [
  { name: "Prayer Essentials", value: 28, color: "#1B4332" },
  { name: "Apparel", value: 22, color: "#B8975A" },
  { name: "Home Decor", value: 18, color: "#2D6A4F" },
  { name: "Books", value: 14, color: "#D4AF6A" },
  { name: "Accessories", value: 10, color: "#EDE0CE" },
  { name: "Other", value: 8, color: "#8C8270" },
];

export function AnalyticsSalesChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={salesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#B8975A" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#B8975A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Jost", fill: "#8C8270" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{ background: "#FAF8F4", border: "1px solid #EDE0CE", borderRadius: "8px", fontFamily: "Jost", fontSize: "12px" }}
          formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
        />
        <Area type="monotone" dataKey="revenue" stroke="#B8975A" strokeWidth={2} fill="url(#revGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AnalyticsTopProducts() {
  return (
    <div className="space-y-3">
      {topProducts.map((p) => (
        <div key={p.name} className="flex items-center gap-3">
          <span className="text-sm font-sans text-brand-charcoal w-28 shrink-0">{p.name}</span>
          <div className="flex-1 bg-brand-beige-dark rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-gold transition-all duration-700"
              style={{ width: `${p.pct}%` }}
            />
          </div>
          <span className="text-xs font-medium font-sans text-brand-stone w-8 text-right">{p.pct}%</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsCategoryChart() {
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={0}>
            {categoryData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2">
        {categoryData.map((c) => (
          <div key={c.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c.color }} />
              <span className="text-xs font-sans text-brand-charcoal">{c.name}</span>
            </div>
            <span className="text-xs font-medium font-sans text-brand-stone">{c.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
