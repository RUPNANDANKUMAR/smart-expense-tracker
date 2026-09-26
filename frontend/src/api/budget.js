import api from "./axios";

export const fetchBudget = async (month) => {
  const response = await api.get("/budget", {
    params: month ? { month } : {},
  });

  return response.data;
};

export const setBudget = async (data) => {
  const response = await api.put("/budget", data);
  return response.data;
};