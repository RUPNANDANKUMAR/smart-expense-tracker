import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../api/expenses";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({
  initialExpense,
  onCancel,
  onSubmit,
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0] || "");
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialExpense) {
      setAmount(String(initialExpense.amount ?? ""));
      setCategory(initialExpense.category || CATEGORIES[0] || "");
      setDate(
        initialExpense.date
          ? String(initialExpense.date).slice(0, 10)
          : todayISO()
      );
      setDescription(initialExpense.description || "");
    } else {
      setAmount("");
      setCategory(CATEGORIES[0] || "");
      setDate(todayISO());
      setDescription("");
    }

    setError("");
  }, [initialExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await onSubmit({
        amount: numericAmount,
        category,
        date,
        description: description.trim(),
      });
    } catch (err) {
      console.error("Failed to save expense:", err);
      setError("Could not save expense. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expense-form-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xl"
      >
        <div>
          <h2
            id="expense-form-title"
            className="text-lg font-semibold text-slate-800"
          >
            {initialExpense ? "Edit Expense" : "Add Expense"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {initialExpense
              ? "Update the details of this expense."
              : "Add a new transaction to your expense tracker."}
          </p>
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="expense-amount"
            className="text-sm font-medium text-slate-700"
          >
            Amount
          </label>

          <input
            id="expense-amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder="e.g. 500"
            autoFocus
            disabled={saving}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="expense-category"
            className="text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="expense-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setError("");
            }}
            disabled={saving}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100"
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="expense-date"
            className="text-sm font-medium text-slate-700"
          >
            Date
          </label>

          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setError("");
            }}
            disabled={saving}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="expense-description"
            className="text-sm font-medium text-slate-700"
          >
            Description
            <span className="ml-1 font-normal text-slate-400">
              (optional)
            </span>
          </label>

          <input
            id="expense-description"
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError("");
            }}
            placeholder="e.g. Lunch with team"
            maxLength={250}
            disabled={saving}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {description.length}/250
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : initialExpense
                ? "Save Changes"
                : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}