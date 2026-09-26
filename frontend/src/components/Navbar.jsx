import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <h1 className="text-base font-bold text-slate-800 sm:text-lg">
        💰 Smart Expense Manager
      </h1>

      <div className="flex items-center gap-3 sm:gap-4">
        {user?.name && (
          <span className="hidden text-sm text-slate-600 sm:block">
            Hi,{" "}
            <span className="font-medium text-slate-800">
              {user.name}
            </span>
          </span>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
        >
          Logout
        </button>
      </div>
    </header>
  );
}