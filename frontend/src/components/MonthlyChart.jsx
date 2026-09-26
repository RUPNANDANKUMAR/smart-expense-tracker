import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const currency = (value) => {
  const amount = Number(value) || 0;

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};

export default function MonthlyChart({ data }) {
  const chartData = Array.isArray(data)
    ? data
        .map((item) => ({
          ...item,
          month: item.month || "Unknown",
          total: Number(item.total) || 0,
        }))
        .filter((item) => item.total >= 0)
    : [];

  if (chartData.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center">
        <p className="text-center text-sm text-slate-500">
          Not enough data yet to show a trend.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
          />

          <Tooltip
            formatter={(value) => currency(value)}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          />

          <Bar
            dataKey="total"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}