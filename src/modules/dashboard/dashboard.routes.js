const express = require("express");
const dashboardController = require("./dashboard.controller");

const router = express.Router();

router.get("/stats", dashboardController.getDashboardSummary);

module.exports = router;