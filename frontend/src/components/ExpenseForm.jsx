import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../api/expenses";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ initialExpense, onCancel, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialExpense) {
      setAmount(String(initialExpense.amount ?? ""));
      setCategory(initialExpense.category || CATEGORIES[0]);
      setDate(initialExpense.date ? initialExpense.date.slice(0, 10) : todayISO());
      setDescription(initialExpense.description || "");
    }
  }, [initialExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount greater than 0");
      return;
    }
    if (!date) {
      setError("Pick a date");
      return;
    }
    setError("");
    onSubmit({ amount: numericAmount, category, date, description: description.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">
          {initialExpense ? "Edit expense" : "Add expense"}
        </h2>

        <div>
          <label className="text-sm font-medium text-slate-600">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="0.00"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="e.g. Lunch with team"
            maxLength={250}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-brand-600 text-white hover:bg-brand-700">
            {initialExpense ? "Save changes" : "Add expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
