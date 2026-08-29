import api from "./axios";

export const fetchInsights = () => api.get("/insights").then((r) => r.data);
export const askAssistant = (question) => api.post("/insights/ask", { question }).then((r) => r.data);
