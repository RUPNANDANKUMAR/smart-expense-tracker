const mongoose = require("mongoose");

// One budget document per user per month, e.g. month: "2026-08"
const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    month: {
      type: String, // format: YYYY-MM
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: 0,
    },
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
