const mongoose = require("mongoose");
const Expense = require("../models/Expense");

// GET /api/expenses
// Supports: ?category=&search=&startDate=&endDate=
exports.getExpenses = async (req, res, next) => {
  try {
    const { category, search, startDate, endDate } = req.query;

    const filter = {
      user: req.user.id,
    };

    if (category) {
      filter.category = category;
    }

    if (search?.trim()) {
      filter.description = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        const start = new Date(startDate);

        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({
            message: "Invalid start date",
          });
        }

        start.setHours(0, 0, 0, 0);
        filter.date.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);

        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({
            message: "Invalid end date",
          });
        }

        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const expenses = await Expense.find(filter).sort({
      date: -1,
      createdAt: -1,
    });

    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

// GET /api/expenses/:id
exports.getExpenseById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid expense ID",
      });
    }

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json(expense);
  } catch (err) {
    next(err);
  }
};

// POST /api/expenses
exports.createExpense = async (req, res, next) => {
  try {
    const {
      amount,
      category,
      date,
      description,
    } = req.body;

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const expense = await Expense.create({
      user: req.user.id,
      amount: numericAmount,
      category,
      date,
      description: description?.trim() || "",
    });

    res.status(201).json(expense);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }

    next(err);
  }
};

// PUT /api/expenses/:id
exports.updateExpense = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid expense ID",
      });
    }

    const updateData = {};

    if (req.body.amount !== undefined) {
      const numericAmount = Number(req.body.amount);

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
          message: "Amount must be greater than 0",
        });
      }

      updateData.amount = numericAmount;
    }

    if (req.body.category !== undefined) {
      updateData.category = req.body.category;
    }

    if (req.body.date !== undefined) {
      updateData.date = req.body.date;
    }

    if (req.body.description !== undefined) {
      updateData.description = String(req.body.description).trim();
    }

    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json(expense);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }

    next(err);
  }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid expense ID",
      });
    }

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json({
      message: "Expense deleted",
      id: req.params.id,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/expenses/summary/dashboard
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const [
      totalAgg,
      monthAgg,
      recent,
      byCategory,
    ] = await Promise.all([
      Expense.aggregate([
        {
          $match: {
            user: userId,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Expense.aggregate([
        {
          $match: {
            user: userId,
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Expense.find({
        user: req.user.id,
      })
        .sort({
          date: -1,
          createdAt: -1,
        })
        .limit(5),

      Expense.aggregate([
        {
          $match: {
            user: userId,
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: "$category",
            total: {
              $sum: "$amount",
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
      ]),
    ]);

    res.json({
      totalExpenses: Number(totalAgg[0]?.total) || 0,
      monthlyExpenses: Number(monthAgg[0]?.total) || 0,
      recentTransactions: recent,
      byCategory: byCategory.map((item) => ({
        category: item._id || "Others",
        total: Number(item.total) || 0,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/expenses/summary/monthly
// Returns the last 6 months with zero values included.
exports.getMonthlyTrend = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();

    const firstMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1,
      0,
      0,
      0,
      0
    );

    const results = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: firstMonth,
          },
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$date",
            },
            month: {
              $month: "$date",
            },
          },
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const totals = new Map(
      results.map((item) => {
        const key = `${item._id.year}-${String(item._id.month).padStart(
          2,
          "0"
        )}`;

        return [key, Number(item.total) || 0];
      })
    );

    const months = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - i),
        1
      );

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      months.push({
        month: key,
        total: totals.get(key) || 0,
      });
    }

    res.json(months);
  } catch (err) {
    next(err);
  }
};