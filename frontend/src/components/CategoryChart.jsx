import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#f59e0b", "#a855f7", "#ec4899", "#ef4444", "#64748b"];

export default function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-500 text-center py-12">No expenses this month yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((entry, index) => (
            <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => value.toLocaleString(undefined, { style: "currency", currency: "USD" })} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
