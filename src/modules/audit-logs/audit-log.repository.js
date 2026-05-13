const AuditLog = require("./audit-log.model");

async function createAuditLog(data) {
    return await AuditLog.create(data);
}

async function findAllAuditLogs(filter, options) {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        AuditLog.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit),

        AuditLog.countDocuments(filter),
    ]);

    return {
        logs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

async function findAllAuditLogs(filter, options) {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        AuditLog.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit),

        AuditLog.countDocuments(filter),
    ]);

    return {
        logs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

module.exports = {
    createAuditLog,
    findAllAuditLogs,
};