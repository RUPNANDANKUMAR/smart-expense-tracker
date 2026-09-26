import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard.jsx";
import CategoryChart from "../components/CategoryChart.jsx";
import MonthlyChart from "../components/MonthlyChart.jsx";
import {
  fetchDashboardSummary,
  fetchMonthlyTrend,
} from "../api/expenses.js";
import { fetchBudget } from "../api/budget.js";

// Change INR to USD only if your backend/database is actually using USD.
const currency = (value) => {
  const amount = Number(value) || 0;

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [summaryData, trendData, budgetData] = await Promise.all([
          fetchDashboardSummary(),
          fetchMonthlyTrend(),
          fetchBudget(),
        ]);

        setSummary(summaryData);
        setTrend(Array.isArray(trendData) ? trendData : []);
        setBudget(budgetData);
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError(
          "Could not load dashboard data. Please check your connection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          No dashboard data available.
        </p>
      </div>
    );
  }

  const recentTransactions = Array.isArray(summary.recentTransactions)
    ? summary.recentTransactions
    : [];

  const monthlyExpenses = Number(summary.monthlyExpenses) || 0;
  const totalExpenses = Number(summary.totalExpenses) || 0;
  const remainingBudget = Number(budget?.remaining) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your spending at a glance
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Expenses"
          value={currency(totalExpenses)}
        />

        <StatCard
          label="This Month"
          value={currency(monthlyExpenses)}
        />

        <StatCard
          label="Remaining Budget"
          value={currency(remainingBudget)}
          tone={remainingBudget < 0 ? "danger" : "success"}
        />

        <StatCard
          label="Recent Transactions"
          value={recentTransactions.length}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Category Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Spending by Category
          </h3>

          <CategoryChart data={summary.byCategory || []} />
        </div>

        {/* Monthly Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Last 6 Months
          </h3>

          <MonthlyChart data={trend} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Recent Transactions
        </h3>

        {recentTransactions.length === 0 ? (
          <div className="rounded-lg bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500">
              No transactions yet.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentTransactions.map((transaction) => {
              const amount = Number(transaction.amount) || 0;

              return (
                <li
                  key={transaction._id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {transaction.description ||
                        transaction.category ||
                        "Expense"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {transaction.date
                        ? new Date(
                            transaction.date
                          ).toLocaleDateString("en-IN")
                        : "No date"}{" "}
                      · {transaction.category || "Other"}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-sm font-semibold text-slate-800">
                    {currency(amount)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}