import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
  "#ef4444",
  "#64748b",
];

const currency = (value) => {
  const amount = Number(value) || 0;

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};

export default function CategoryChart({ data }) {
  const chartData = Array.isArray(data)
    ? data
        .map((item) => ({
          ...item,
          total: Number(item.total) || 0,
          category: item.category || "Other",
        }))
        .filter((item) => item.total > 0)
    : [];

  if (chartData.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center">
        <p className="text-center text-sm text-slate-500">
          No expenses this month yet.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={85}
            innerRadius={45}
            paddingAngle={2}
            label={({ category, percent }) =>
              `${category} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`${entry.category}-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => currency(value)}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}