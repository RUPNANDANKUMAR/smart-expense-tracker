import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseTable from "../components/ExpenseTable.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { fetchExpenses, createExpense, updateExpense, deleteExpense, CATEGORIES } from "../api/expenses.js";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const data = await fetchExpenses(params);
      setExpenses(data);
    } catch (err) {
      setError("Could not load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, startDate, endDate]);

  const handleAdd = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEdit = (exp) => {
    setEditingExpense(exp);
    setShowForm(true);
  };

  const handleSubmit = async (payload) => {
    if (editingExpense) {
      await updateExpense(editingExpense._id, payload);
    } else {
      await createExpense(payload);
    }
    setShowForm(false);
    setEditingExpense(null);
    load();
  };

  const handleDeleteConfirmed = async () => {
    await deleteExpense(deletingExpense._id);
    setDeletingExpense(null);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Expenses</h2>
          <p className="text-sm text-slate-500">Track and manage every transaction</p>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 text-sm rounded-lg bg-brand-600 text-white hover:bg-brand-700">
          + Add expense
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs font-medium text-slate-500">Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        {(search || category || startDate || endDate) && (
          <button
            onClick={() => { setSearch(""); setCategory(""); setStartDate(""); setEndDate(""); }}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-500">Loading expenses...</p>
      ) : (
        <ExpenseTable expenses={expenses} onEdit={handleEdit} onDelete={setDeletingExpense} />
      )}

      {showForm && (
        <ExpenseForm
          initialExpense={editingExpense}
          onCancel={() => { setShowForm(false); setEditingExpense(null); }}
          onSubmit={handleSubmit}
        />
      )}

      {deletingExpense && (
        <ConfirmModal
          title="Delete expense"
          message={`Delete this ${deletingExpense.category} expense of ${deletingExpense.amount}? This can't be undone.`}
          onCancel={() => setDeletingExpense(null)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}
