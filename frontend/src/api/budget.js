import api from "./axios";

export const fetchBudget = (month) => api.get("/budget", { params: month ? { month } : {} }).then((r) => r.data);
export const setBudget = (data) => api.put("/budget", data).then((r) => r.data);
