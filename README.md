# Smart Expense Management System

A full-stack MERN application for tracking personal expenses, managing a monthly budget,
and getting data-driven spending insights.

**Stack:** React + Tailwind CSS (frontend) · Express + Node.js (backend) · MongoDB + Mongoose (database) · JWT auth · Recharts

## Features
- **Auth** — register/login with hashed passwords (bcrypt) and JWT-protected routes
- **Expense CRUD** — add, edit, delete expenses with amount, category, date, description
- **Filters & search** — by category, date range, and text search
- **Dashboard** — total spend, monthly spend, remaining budget, recent transactions
- **Charts** — category breakdown (pie) and 6-month trend (bar), via Recharts
- **Budget tracking** — set a monthly budget, progress bar, near-limit and over-budget warnings
- **Insights / AI assistant** — rule-based analytics (highest category, month-over-month
  comparison, daily average, savings suggestions) answered through a simple chat UI.
  This runs entirely on your own data with no external API key required. See
  "Wiring in a real LLM" below to upgrade it to a genuine AI assistant.

