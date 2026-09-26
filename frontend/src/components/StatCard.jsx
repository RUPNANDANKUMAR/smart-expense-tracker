import React from "react";

const toneClasses = {
  default: "text-slate-800",
  danger: "text-red-600",
  success: "text-green-600",
};

export default function StatCard({
  label,
  value,
  tone = "default",
}) {
  const valueColor = toneClasses[tone] || toneClasses.default;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className={`mt-2 break-words text-2xl font-bold ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}