const express = require("express");
const eventRoutes = require("../modules/events/event.routes");
const eventTemplateRoutes = require("../modules/event-templates/event-template.routes");
const auditLogRoutes = require("../modules/audit-logs/audit-log.routes");
const dashboardRoutes = require("../modules/dashboard/dashboard.routes");

const router = express.Router();

router.use("/events", eventRoutes);
router.use("/event-templates", eventTemplateRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;