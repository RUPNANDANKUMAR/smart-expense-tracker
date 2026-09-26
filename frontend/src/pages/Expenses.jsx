import React, { useEffect, useState } from "react";

import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseTable from "../components/ExpenseTable.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  CATEGORIES,
} from "../api/expenses.js";

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

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category) {
        params.category = category;
      }

      if (startDate) {
        params.startDate = startDate;
      }

      if (endDate) {
        params.endDate = endDate;
      }

      const data = await fetchExpenses(params);

      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError("Could not load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      load();
    }, 300);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, startDate, endDate]);

  const handleAdd = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleSubmit = async (payload) => {
    try {
      setError("");

      if (editingExpense) {
        await updateExpense(editingExpense._id, payload);
      } else {
        await createExpense(payload);
      }

      setShowForm(false);
      setEditingExpense(null);

      await load();
    } catch (err) {
      console.error("Failed to save expense:", err);
      setError("Could not save expense. Please try again.");
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deletingExpense) return;

    try {
      setError("");

      await deleteExpense(deletingExpense._id);

      setDeletingExpense(null);

      await load();
    } catch (err) {
      console.error("Failed to delete expense:", err);
      setError("Could not delete expense. Please try again.");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setStartDate("");
    setEndDate("");
  };

  const hasFilters =
    search || category || startDate || endDate;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Expenses
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track and manage your transactions
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          + Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="min-w-[180px] flex-1">
          <label
            htmlFor="expense-search"
            className="text-xs font-medium text-slate-500"
          >
            Search
          </label>

          <input
            id="expense-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="expense-category"
            className="text-xs font-medium text-slate-500"
          >
            Category
          </label>

          <select
            id="expense-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">All Categories</option>

            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label
            htmlFor="start-date"
            className="text-xs font-medium text-slate-500"
          >
            From
          </label>

          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* End Date */}
        <div>
          <label
            htmlFor="end-date"
            className="text-xs font-medium text-slate-500"
          >
            To
          </label>

          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg px-2 py-2 text-sm text-slate-500 underline transition hover:text-slate-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Expense Table */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            Loading expenses...
          </p>
        </div>
      ) : (
        <ExpenseTable
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={setDeletingExpense}
        />
      )}

      {/* Add/Edit Expense */}
      {showForm && (
        <ExpenseForm
          initialExpense={editingExpense}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* Delete Confirmation */}
      {deletingExpense && (
        <ConfirmModal
          title="Delete Expense"
          message={`Delete this ${
            deletingExpense.category || "expense"
          } expense of ${
            deletingExpense.amount || 0
          }? This action cannot be undone.`}
          onCancel={() => setDeletingExpense(null)}
          onConfirm={handleDeleteConfirmed}
        />
      )}
    </div>
  );
}