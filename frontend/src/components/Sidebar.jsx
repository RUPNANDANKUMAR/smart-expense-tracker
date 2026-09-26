import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/",
    label: "Dashboard",
    icon: "📊",
    end: true,
  },
  {
    to: "/expenses",
    label: "Expenses",
    icon: "🧾",
  },
  {
    to: "/budget",
    label: "Budget",
    icon: "🎯",
  },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-56 shrink-0 border-r border-slate-200 bg-white py-4 md:block">
      <nav className="flex flex-col gap-1 px-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`
            }
          >
            <span className="text-base" aria-hidden="true">
              {link.icon}
            </span>

            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}