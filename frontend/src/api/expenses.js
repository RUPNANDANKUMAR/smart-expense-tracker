import api from "./axios";

export const fetchExpenses = async (params = {}) => {
  const response = await api.get("/expenses", { params });
  return response.data;
};

export const createExpense = async (data) => {
  const response = await api.post("/expenses", data);
  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await api.put(`/expenses/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

export const fetchDashboardSummary = async () => {
  const response = await api.get("/expenses/summary/dashboard");
  return response.data;
};

export const fetchMonthlyTrend = async () => {
  const response = await api.get("/expenses/summary/monthly");
  return response.data;
};

export const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Bills",
  "Others",
];