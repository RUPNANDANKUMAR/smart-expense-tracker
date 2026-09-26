import React from "react";

const CATEGORY_COLORS = {
  Food: "bg-amber-100 text-amber-800",
  Travel: "bg-blue-100 text-blue-800",
  Shopping: "bg-purple-100 text-purple-800",
  Entertainment: "bg-pink-100 text-pink-800",
  Bills: "bg-red-100 text-red-800",
  Others: "bg-slate-100 text-slate-700",
};

const currency = (value) => {
  const amount = Number(value) || 0;

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};

export default function ExpenseTable({
  expenses = [],
  onEdit,
  onDelete,
}) {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">
          No expenses found.
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Try adjusting your filters or add a new expense.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 text-right font-medium">
                Amount
              </th>
              <th className="px-4 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => {
              const category = expense.category || "Others";

              return (
                <tr
                  key={expense._id}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {expense.date
                      ? new Date(expense.date).toLocaleDateString("en-IN")
                      : "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        CATEGORY_COLORS[category] ||
                        CATEGORY_COLORS.Others
                      }`}
                    >
                      {category}
                    </span>
                  </td>

                  <td className="max-w-[280px] truncate px-4 py-3 text-slate-600">
                    {expense.description || "—"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-800">
                    {currency(expense.amount)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="font-medium text-brand-600 transition hover:text-brand-700 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(expense)}
                        className="font-medium text-red-600 transition hover:text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}