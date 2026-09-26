import React from "react";

const currency = (value) => {
  const amount = Number(value) || 0;

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};

export default function BudgetProgress({
  amount = 0,
  spent = 0,
  remaining = 0,
  percentUsed = 0,
}) {
  const budgetAmount = Number(amount) || 0;
  const spentAmount = Number(spent) || 0;
  const remainingAmount = Number(remaining) || 0;
  const usagePercent = Number(percentUsed) || 0;

  const isOverBudget = remainingAmount < 0;
  const isNearLimit = !isOverBudget && usagePercent >= 80;

  const barWidth = Math.min(100, Math.max(0, usagePercent));

  const barColor = isOverBudget
    ? "bg-red-500"
    : isNearLimit
      ? "bg-amber-500"
      : "bg-brand-500";

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Amounts */}
      <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-600">
        <span>
          Spent:{" "}
          <strong className="text-slate-800">
            {currency(spentAmount)}
          </strong>
        </span>

        <span>
          Budget:{" "}
          <strong className="text-slate-800">
            {currency(budgetAmount)}
          </strong>
        </span>
      </div>

      {/* Progress */}
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-slate-100"
        aria-label={`Budget usage: ${Math.round(usagePercent)}%`}
      >
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {/* Percentage */}
      <div className="flex justify-between text-xs text-slate-500">
        <span>Budget used</span>

        <span className="font-medium text-slate-700">
          {Math.round(usagePercent)}%
        </span>
      </div>

      {/* Status */}
      {isOverBudget ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          You've gone {currency(Math.abs(remainingAmount))} over budget this
          month.
        </p>
      ) : isNearLimit ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-600">
          Heads up — you've used {Math.round(usagePercent)}% of your budget.
          {" "}
          {currency(remainingAmount)} left.
        </p>
      ) : (
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {currency(remainingAmount)} remaining this month.
        </p>
      )}
    </div>
  );
}