const express = require("express");
const auditLogController = require("./audit-log.controller");

const router = express.Router();

router.get("/", auditLogController.getAllAuditLogs);

module.exports = router;