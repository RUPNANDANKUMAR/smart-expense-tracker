const express = require("express");
const router = express.Router();
const { getInsights, askAssistant } = require("../controllers/insightsController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", getInsights);
router.post("/ask", askAssistant);

module.exports = router;
