const Expense = require("../models/Expense");

// GET /api/expenses  (supports ?category=&search=&startDate=&endDate=)
exports.getExpenses = async (req, res, next) => {
  try {
    const { category, search, startDate, endDate } = req.query;
    const filter = { user: req.user.id };

    if (category) filter.category = category;
    if (search) filter.description = { $regex: search, $options: "i" };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

// GET /api/expenses/:id
exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

// POST /api/expenses
exports.createExpense = async (req, res, next) => {
  try {
    const { amount, category, date, description } = req.body;
    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      date,
      description,
    });
    res.status(201).json(expense);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

// PUT /api/expenses/:id
exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted", id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// GET /api/expenses/summary/dashboard - aggregate stats for the dashboard
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [totalAgg, monthAgg, recent, byCategory] = await Promise.all([
      Expense.aggregate([
        { $match: { user: require("mongoose").Types.ObjectId.createFromHexString(userId) } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        {
          $match: {
            user: require("mongoose").Types.ObjectId.createFromHexString(userId),
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.find({ user: userId }).sort({ date: -1 }).limit(5),
      Expense.aggregate([
        {
          $match: {
            user: require("mongoose").Types.ObjectId.createFromHexString(userId),
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
      ]),
    ]);

    res.json({
      totalExpenses: totalAgg[0]?.total || 0,
      monthlyExpenses: monthAgg[0]?.total || 0,
      recentTransactions: recent,
      byCategory: byCategory.map((c) => ({ category: c._id, total: c.total })),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/expenses/summary/monthly - last 6 months totals, for the trend chart
exports.getMonthlyTrend = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const results = await Expense.aggregate([
      {
        $match: {
          user: require("mongoose").Types.ObjectId.createFromHexString(userId),
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(
      results.map((r) => ({
        month: `${r._id.year}-${String(r._id.month).padStart(2, "0")}`,
        total: r.total,
      }))
    );
  } catch (err) {
    next(err);
  }
};
