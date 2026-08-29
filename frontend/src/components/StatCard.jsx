import React from "react";

export default function StatCard({ label, value, tone = "default" }) {
  const toneClasses = {
    default: "text-slate-800",
    danger: "text-red-600",
    success: "text-green-600",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${toneClasses[tone]}`}>{value}</p>
    </div>
  );
}
