import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="font-bold text-slate-800">💰 Smart Expense Manager</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">Hi, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
