import React from "react";

export default function BudgetProgress({ amount, spent, remaining, percentUsed }) {
  const isOverBudget = remaining < 0;
  const isNearLimit = !isOverBudget && percentUsed >= 80;

  const barColor = isOverBudget ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-brand-500";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <div className="flex justify-between text-sm text-slate-600">
        <span>Spent: <strong className="text-slate-800">{spent.toLocaleString(undefined, { style: "currency", currency: "USD" })}</strong></span>
        <span>Budget: <strong className="text-slate-800">{amount.toLocaleString(undefined, { style: "currency", currency: "USD" })}</strong></span>
      </div>

      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} transition-all`} style={{ width: `${Math.min(100, percentUsed)}%` }} />
      </div>

      {isOverBudget ? (
        <p className="text-sm text-red-600 font-medium">
          You've gone {Math.abs(remaining).toLocaleString(undefined, { style: "currency", currency: "USD" })} over budget this month.
        </p>
      ) : isNearLimit ? (
        <p className="text-sm text-amber-600 font-medium">
          Heads up — you've used {percentUsed}% of your budget. {remaining.toLocaleString(undefined, { style: "currency", currency: "USD" })} left.
        </p>
      ) : (
        <p className="text-sm text-slate-500">
          {remaining.toLocaleString(undefined, { style: "currency", currency: "USD" })} remaining this month.
        </p>
      )}
    </div>
  );
}
