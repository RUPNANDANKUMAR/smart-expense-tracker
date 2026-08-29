import api from "./axios";

export const fetchExpenses = (params = {}) => api.get("/expenses", { params }).then((r) => r.data);
export const createExpense = (data) => api.post("/expenses", data).then((r) => r.data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data).then((r) => r.data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`).then((r) => r.data);
export const fetchDashboardSummary = () => api.get("/expenses/summary/dashboard").then((r) => r.data);
export const fetchMonthlyTrend = () => api.get("/expenses/summary/monthly").then((r) => r.data);

export const CATEGORIES = ["Food", "Travel", "Shopping", "Entertainment", "Bills", "Others"];
