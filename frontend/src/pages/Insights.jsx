import React, { useEffect, useState } from "react";
import { fetchInsights, askAssistant } from "../api/insights.js";

const currency = (n) => (n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });

const SUGGESTIONS = [
  "Where did I spend the most this month?",
  "How can I save money?",
  "What's my daily average?",
  "How does this month compare to last month?",
];

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fetchInsights()
      .then(setInsights)
      .finally(() => setLoading(false));
  }, []);

  const handleAsk = async (q) => {
    const text = q ?? question;
    if (!text.trim()) return;
    setChat((prev) => [...prev, { role: "user", text }]);
    setQuestion("");
    setAsking(true);
    try {
      const res = await askAssistant(text);
      setChat((prev) => [...prev, { role: "assistant", text: res.answer }]);
    } catch (err) {
      setChat((prev) => [...prev, { role: "assistant", text: "Something went wrong answering that — try again." }]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">AI assistant & insights</h2>
        <p className="text-sm text-slate-500">
          Rule-based analysis over your real spending data — swap in an LLM API call server-side for free-form answers.
        </p>
      </div>

      {!loading && insights && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase">Highest category</p>
            <p className="text-lg font-semibold text-slate-800 mt-1">
              {insights.highestCategory ? insights.highestCategory.category : "—"}
            </p>
            <p className="text-sm text-slate-500">
              {insights.highestCategory ? currency(insights.highestCategory.total) : "No data yet"}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase">Daily average</p>
            <p className="text-lg font-semibold text-slate-800 mt-1">{currency(insights.averageDailySpend)}</p>
            <p className="text-sm text-slate-500">This month so far</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase">Vs last month</p>
            <p className="text-lg font-semibold text-slate-800 mt-1">
              {currency(insights.currentMonthTotal)}
            </p>
            <p className="text-sm text-slate-500">was {currency(insights.previousMonthTotal)}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">Ask about your spending</h3>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleAsk(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {chat.length === 0 ? (
            <p className="text-sm text-slate-400">Ask a question above, or type your own below.</p>
          ) : (
            chat.map((msg, i) => (
              <div key={i} className={`text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${
                    msg.role === "user" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
          className="flex gap-2"
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your expenses..."
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={asking}
            className="px-4 py-2 text-sm rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {asking ? "..." : "Ask"}
          </button>
        </form>
      </div>
    </div>
  );
}
