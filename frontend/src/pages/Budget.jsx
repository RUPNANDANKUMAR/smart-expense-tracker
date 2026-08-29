import React, { useEffect, useState } from "react";
import BudgetProgress from "../components/BudgetProgress.jsx";
import { fetchBudget, setBudget as setBudgetApi } from "../api/budget.js";

export default function Budget() {
  const [budget, setBudget] = useState(null);
  const [amountInput, setAmountInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchBudget();
      setBudget(data);
      setAmountInput(String(data.amount || ""));
    } catch (err) {
      setError("Could not load your budget.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numeric = parseFloat(amountInput);
    if (isNaN(numeric) || numeric < 0) {
      setError("Enter a valid budget amount");
      return;
    }
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await setBudgetApi({ amount: numeric });
      setSuccess("Budget updated");
      await load();
    } catch (err) {
      setError("Could not save budget");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading budget...</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Monthly budget</h2>
        <p className="text-sm text-slate-500">Set a limit and track how close you are to it, for {budget.month}</p>
      </div>

      {budget && <BudgetProgress {...budget} />}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <label className="text-sm font-medium text-slate-600">Set budget for {budget.month}</label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="e.g. 1500"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
      </form>
    </div>
  );
}
