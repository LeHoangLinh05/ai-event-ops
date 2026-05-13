const express = require("express");
const dashboardController = require("./dashboard.controller");

const router = express.Router();

router.get("/summary", dashboardController.getDashboardSummary);

module.exports = router;