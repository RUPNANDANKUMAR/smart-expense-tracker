import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard.jsx";
import CategoryChart from "../components/CategoryChart.jsx";
import MonthlyChart from "../components/MonthlyChart.jsx";
import { fetchDashboardSummary, fetchMonthlyTrend } from "../api/expenses.js";
import { fetchBudget } from "../api/budget.js";

const currency = (n) => (n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchDashboardSummary(), fetchMonthlyTrend(), fetchBudget()])
      .then(([s, t, b]) => {
        setSummary(s);
        setTrend(t);
        setBudget(b);
      })
      .catch(() => setError("Could not load dashboard data. Is the backend server running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500 text-sm">Loading dashboard...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">Your spending at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total expenses" value={currency(summary.totalExpenses)} />
        <StatCard label="This month" value={currency(summary.monthlyExpenses)} />
        <StatCard
          label="Remaining budget"
          value={currency(budget?.remaining)}
          tone={budget?.remaining < 0 ? "danger" : "success"}
        />
        <StatCard label="Recent transactions" value={summary.recentTransactions.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Spending by category (this month)</h3>
          <CategoryChart data={summary.byCategory} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Last 6 months</h3>
          <MonthlyChart data={trend} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent transactions</h3>
        {summary.recentTransactions.length === 0 ? (
          <p className="text-sm text-slate-500">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {summary.recentTransactions.map((t) => (
              <li key={t._id} className="py-2 flex justify-between text-sm">
                <div>
                  <p className="text-slate-800">{t.description || t.category}</p>
                  <p className="text-slate-400 text-xs">{new Date(t.date).toLocaleDateString()} · {t.category}</p>
                </div>
                <p className="font-medium text-slate-800">{currency(t.amount)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
