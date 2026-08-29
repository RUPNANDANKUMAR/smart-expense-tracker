const mongoose = require("mongoose");

const CATEGORIES = ["Food", "Travel", "Shopping", "Entertainment", "Bills", "Others"];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, "Category is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);
module.exports.CATEGORIES = CATEGORIES;
