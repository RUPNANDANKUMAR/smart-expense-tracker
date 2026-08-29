const Expense = require("../models/Expense");
const mongoose = require("mongoose");

const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthBounds = (year, month) => ({
  start: new Date(year, month - 1, 1),
  end: new Date(year, month, 0, 23, 59, 59),
});

// Builds a plain-data analytics summary for the signed-in user.
// This is intentionally rule-based (no external API call) so the project
// runs end-to-end without needing a paid LLM key. To wire in a real AI
// assistant for Day 19-21 of the plan, take this same summary object,
// stringify it, and send it as context to your LLM provider of choice.
async function buildAnalytics(userId) {
  const now = new Date();
  const { start: curStart, end: curEnd } = monthBounds(now.getFullYear(), now.getMonth() + 1);
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const { start: prevStart, end: prevEnd } = monthBounds(prevDate.getFullYear(), prevDate.getMonth() + 1);

  const uid = mongoose.Types.ObjectId.createFromHexString(userId);

  const [currentByCategory, previousByCategory, currentTotal, previousTotal, allTime] = await Promise.all([
    Expense.aggregate([
      { $match: { user: uid, date: { $gte: curStart, $lte: curEnd } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]),
    Expense.aggregate([
      { $match: { user: uid, date: { $gte: prevStart, $lte: prevEnd } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { user: uid, date: { $gte: curStart, $lte: curEnd } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { user: uid, date: { $gte: prevStart, $lte: prevEnd } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.find({ user: uid }).sort({ date: 1 }).limit(1),
  ]);

  const prevMap = Object.fromEntries(previousByCategory.map((c) => [c._id, c.total]));
  const categoryChanges = currentByCategory.map((c) => {
    const prev = prevMap[c._id] || 0;
    const change = prev > 0 ? Math.round(((c.total - prev) / prev) * 100) : null;
    return { category: c._id, current: c.total, previous: prev, percentChange: change };
  });

  const daysElapsedThisMonth = Math.min(
    now.getDate(),
    new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  );
  const avgDaily = daysElapsedThisMonth > 0 ? (currentTotal[0]?.total || 0) / daysElapsedThisMonth : 0;

  return {
    currentMonth: monthKey(now),
    previousMonth: monthKey(prevDate),
    currentMonthTotal: currentTotal[0]?.total || 0,
    previousMonthTotal: previousTotal[0]?.total || 0,
    highestCategory: currentByCategory[0] || null,
    categoryChanges,
    averageDailySpend: Math.round(avgDaily * 100) / 100,
    trackingStartDate: allTime[0]?.date || null,
  };
}

// GET /api/insights - structured analytics for the Insights page
exports.getInsights = async (req, res, next) => {
  try {
    const data = await buildAnalytics(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /api/insights/ask - simple rule-based assistant over the user's real data.
// Body: { question: string }
exports.askAssistant = async (req, res, next) => {
  try {
    const { question = "" } = req.body;
    const q = question.toLowerCase();
    const data = await buildAnalytics(req.user.id);

    let answer;

    if (q.includes("most") || q.includes("highest")) {
      answer = data.highestCategory
        ? `You've spent the most on ${data.highestCategory.category} this month, totalling ${data.highestCategory.total.toFixed(2)}.`
        : "You don't have any expenses logged for this month yet.";
    } else if (q.includes("save") || q.includes("saving")) {
      const worstIncrease = data.categoryChanges
        .filter((c) => c.percentChange !== null)
        .sort((a, b) => b.percentChange - a.percentChange)[0];
      answer = worstIncrease && worstIncrease.percentChange > 0
        ? `Your ${worstIncrease.category} spending is up ${worstIncrease.percentChange}% versus last month. Setting a category budget there is the fastest way to save.`
        : "Your spending looks stable compared to last month. Consider setting a monthly budget if you haven't already, to keep it that way.";
    } else if (q.includes("average") || q.includes("daily")) {
      answer = `You're averaging about ${data.averageDailySpend.toFixed(2)} per day this month.`;
    } else if (q.includes("compare") || q.includes("last month")) {
      const diff = data.currentMonthTotal - data.previousMonthTotal;
      const direction = diff >= 0 ? "more" : "less";
      answer = `You've spent ${Math.abs(diff).toFixed(2)} ${direction} this month (${data.currentMonthTotal.toFixed(2)}) than last month (${data.previousMonthTotal.toFixed(2)}).`;
    } else {
      answer =
        "I can answer questions like \"Where did I spend the most this month?\", \"How can I save money?\", \"What's my daily average?\", or \"How does this month compare to last month?\".";
    }

    res.json({ question, answer, data });
  } catch (err) {
    next(err);
  }
};
