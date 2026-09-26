require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");
const budgetRoutes = require("./routes/budget");

const app = express();

const PORT = process.env.PORT || 5000;

const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ====================
// CORS
// ====================
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ====================
// BODY PARSER
// ====================
app.use(express.json());

// ====================
// ROOT ROUTE
// ====================
app.get("/", (req, res) => {
  res.json({
    message: "Smart Expense Tracker API is running",
  });
});

// ====================
// FAVICON
// ====================
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// ====================
// HEALTH CHECK
// ====================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// ====================
// API ROUTES
// ====================
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);

// ====================
// ERROR HANDLING
// ====================
app.use(notFound);
app.use(errorHandler);

// ====================
// CONNECT DATABASE
// ====================
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });