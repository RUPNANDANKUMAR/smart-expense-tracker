import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/expenses", label: "Expenses", icon: "🧾" },
  { to: "/budget", label: "Budget", icon: "🎯" },
  { to: "/insights", label: "AI Assistant", icon: "🤖" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r bg-white h-[calc(100vh-56px)] sticky top-14 py-4">
      <nav className="flex flex-col gap-1 px-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
