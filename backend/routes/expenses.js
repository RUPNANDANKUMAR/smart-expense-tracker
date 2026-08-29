const express = require("express");
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getDashboardSummary,
  getMonthlyTrend,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/summary/dashboard", getDashboardSummary);
router.get("/summary/monthly", getMonthlyTrend);

router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
