import React from "react";

const CATEGORY_COLORS = {
  Food: "bg-amber-100 text-amber-800",
  Travel: "bg-blue-100 text-blue-800",
  Shopping: "bg-purple-100 text-purple-800",
  Entertainment: "bg-pink-100 text-pink-800",
  Bills: "bg-red-100 text-red-800",
  Others: "bg-slate-100 text-slate-700",
};

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p className="text-sm text-slate-500 py-8 text-center">No expenses found. Try adjusting your filters or add a new one.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium text-right">Amount</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-600">{new Date(exp.date).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Others}`}>
                  {exp.category}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{exp.description || "—"}</td>
              <td className="px-4 py-3 text-right font-medium text-slate-800">
                {exp.amount.toLocaleString(undefined, { style: "currency", currency: "USD" })}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => onEdit(exp)} className="text-brand-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => onDelete(exp)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
