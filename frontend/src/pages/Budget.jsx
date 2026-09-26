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
    setError("");

    try {
      const data = await fetchBudget();

      setBudget(data);
      setAmountInput(
        data?.amount !== undefined && data?.amount !== null
          ? String(data.amount)
          : ""
      );
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

    const numeric = Number(amountInput);

    if (!Number.isFinite(numeric) || numeric < 0) {
      setError("Enter a valid budget amount.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await setBudgetApi({ amount: numeric });

      setSuccess("Budget updated successfully.");
      await load();
    } catch (err) {
      setError("Could not save budget.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500">Loading budget...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Monthly Budget
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Set your monthly spending limit and track your progress for{" "}
          <span className="font-medium text-slate-700">
            {budget?.month || "this month"}
          </span>
        </p>
      </div>

      {/* Budget Progress */}
      {budget && <BudgetProgress {...budget} />}

      {/* Budget Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label
            htmlFor="budget"
            className="text-sm font-medium text-slate-700"
          >
            Monthly Budget
          </label>

          <p className="mt-1 text-xs text-slate-500">
            Set the maximum amount you want to spend this month.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            id="budget"
            type="number"
            step="0.01"
            min="0"
            value={amountInput}
            onChange={(e) => {
              setAmountInput(e.target.value);
              setError("");
              setSuccess("");
            }}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            placeholder="e.g. 1500"
            disabled={saving}
          />

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Budget"}
          </button>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
            {success}
          </p>
        )}
      </form>
    </div>
  );
}