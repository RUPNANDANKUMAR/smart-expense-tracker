const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

const currentMonthKey = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

// GET /api/budget?month=YYYY-MM
exports.getBudget = async (req, res, next) => {
  try {
    const month = req.query.month || currentMonthKey();

    const budget = await Budget.findOne({
      user: req.user.id,
      month,
    });

    const [year, mo] = month.split("-").map(Number);

    const startOfMonth = new Date(year, mo - 1, 1);
    const endOfMonth = new Date(year, mo, 0, 23, 59, 59, 999);

    const spentAgg = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
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
    ]);

    const spent = Number(spentAgg[0]?.total) || 0;
    const amount = Number(budget?.amount) || 0;

    res.json({
      month,
      amount,
      spent,
      remaining: amount - spent,
      percentUsed:
        amount > 0
          ? Math.round((spent / amount) * 100)
          : 0,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/budget
exports.setBudget = async (req, res, next) => {
  try {
    const { amount, month } = req.body;

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      return res.status(400).json({
        message: "A valid budget amount is required",
      });
    }

    const key = month || currentMonthKey();

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user.id,
        month: key,
      },
      {
        amount: numericAmount,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.json(budget);
  } catch (err) {
    next(err);
  }
};