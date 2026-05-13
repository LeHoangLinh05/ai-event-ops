const auditLogService = require("./audit-log.service");

async function getAllAuditLogs(req, res, next) {
    try {
        const result = await auditLogService.getAllAuditLogs(req.query);

        res.json({
            success: true,
            data: result.logs,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllAuditLogs,
};