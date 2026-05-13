const auditLogRepository = require("./audit-log.repository");

async function createAuditLog(data) {
    return await auditLogRepository.createAuditLog(data);
}

async function getAllAuditLogs(query) {
    const {
        action,
        entityType,
        operator,
        page = 1,
        limit = 10,
    } = query;

    const filter = {};

    if (action) {
        filter.action = action;
    }

    if (entityType) {
        filter.entityType = entityType;
    }

    if (operator) {
        filter.operator = operator;
    }

    const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { createdAt: -1 },
    };

    return await auditLogRepository.findAllAuditLogs(filter, options);
}

module.exports = {
    createAuditLog,
    getAllAuditLogs,
};