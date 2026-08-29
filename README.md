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

## Project structure
```
expense-tracker/
├── backend/
│   ├── config/db.js
│   ├── models/          User.js, Expense.js, Budget.js
│   ├── controllers/     authController, expenseController, budgetController, insightsController
│   ├── routes/          auth.js, expenses.js, budget.js, insights.js
│   ├── middleware/      auth.js (JWT), errorHandler.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/          axios instance + auth/expenses/budget/insights calls
    │   ├── context/       AuthContext.jsx
    │   ├── components/    Navbar, Sidebar, ProtectedRoute, ExpenseForm, ExpenseTable,
    │   │                  StatCard, CategoryChart, MonthlyChart, BudgetProgress, ConfirmModal
    │   ├── pages/          Login, Register, Dashboard, Expenses, Budget, Insights
    │   └── App.jsx
    ├── index.html
    ├── tailwind.config.js
    └── vite.config.js
```

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # edit MONGODB_URI and set a real JWT_SECRET
npm run dev             # http://localhost:5000
```
Requires a running MongoDB instance — local `mongod` or a free MongoDB Atlas cluster.
Generate a strong `JWT_SECRET`, e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```
The Vite dev server proxies `/api` to `http://localhost:5000`, so with both servers running,
open http://localhost:5173, register an account, and start adding expenses.

## API reference

| Method | Endpoint                        | Auth | Description |
|--------|----------------------------------|------|--------------|
| POST   | /api/auth/register                | No   | Create account, returns JWT |
| POST   | /api/auth/login                   | No   | Login, returns JWT |
| GET    | /api/auth/me                      | Yes  | Current user profile |
| GET    | /api/expenses                     | Yes  | List (supports `?category=&search=&startDate=&endDate=`) |
| POST   | /api/expenses                     | Yes  | Create expense |
| PUT    | /api/expenses/:id                  | Yes  | Update expense |
| DELETE | /api/expenses/:id                  | Yes  | Delete expense |
| GET    | /api/expenses/summary/dashboard     | Yes  | Totals, monthly total, recent transactions, by-category breakdown |
| GET    | /api/expenses/summary/monthly       | Yes  | Last 6 months totals for trend chart |
| GET    | /api/budget                       | Yes  | Current (or `?month=YYYY-MM`) budget, spend, remaining, % used |
| PUT    | /api/budget                       | Yes  | Set/update budget for a month |
| GET    | /api/insights                     | Yes  | Highest category, month-over-month %, daily average |
| POST   | /api/insights/ask                  | Yes  | Ask a question about your spending (rule-based) |

## Wiring in a real LLM (Phase 5 of the original plan)
`insightsController.js` already builds a clean analytics summary object (`buildAnalytics`)
from the user's real MongoDB data. To turn the rule-based assistant into a genuine AI assistant:
1. Add an API key for your LLM provider to `.env` (never commit it)
2. In `askAssistant`, instead of the if/else rules, `JSON.stringify(data)` and send it as
   context alongside the user's question to the LLM API
3. Return the model's response as `answer`

This keeps the whole app runnable and demoable without a paid key, while leaving a clean
seam to plug in real AI in an afternoon — good talking point for interviews.

## Suggested resume bullet points
- Built a full-stack MERN expense tracker with JWT authentication, RESTful CRUD APIs, and
  MongoDB aggregation pipelines for real-time analytics
- Designed a budget-tracking system with month-scoped documents and progress visualization
- Implemented category/date/text filtering and a 6-month spending trend using Recharts
- Architected a data-driven insights engine, structured for a drop-in LLM integration

## Next steps before deploying
- Deploy backend (Render/Railway) + MongoDB Atlas + frontend (Vercel/Netlify)
- Add input validation library (e.g. `express-validator` or `zod`) for stricter API validation
- Add automated tests (Jest/Supertest for backend, Vitest/RTL for frontend)
- Add pagination for the expense list once data volume grows
