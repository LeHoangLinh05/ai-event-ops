const templateService = require("./event-template.service");
const auditLogService = require("../audit-logs/audit-log.service");

async function createTemplate(req, res, next) {
    try {
        const template = await templateService.createTemplate(req.body);

        await auditLogService.createAuditLog({
            action: "CREATE_EVENT_TEMPLATE",
            entityType: "EVENT_TEMPLATE",
            entityId: template._id,
            operator: "anonymous",
            metadata: {
                ip: req.ip,
                userAgent: req.headers["user-agent"],
                requestBody: req.body,
            },
        });

        res.status(201).json({
            success: true,
            message: "Event template created successfully",
            data: template,
        });
    } catch (error) {
        next(error);
    }
}

async function getAllTemplates(req, res, next) {
    try {
        const templates = await templateService.getAllTemplates();

        res.json({
            success: true,
            data: templates,
        });
    } catch (error) {
        next(error);
    }
}

async function getTemplateById(req, res, next) {
    try {
        const template = await templateService.getTemplateById(req.params.id);

        res.json({
            success: true,
            data: template,
        });
    } catch (error) {
        next(error);
    }
}

async function updateTemplate(req, res, next) {
    try {
        const template = await templateService.updateTemplate(
            req.params.id,
            req.body
        );

        await auditLogService.createAuditLog({
            action: "UPDATE_EVENT_TEMPLATE",
            entityType: "EVENT_TEMPLATE",
            entityId: template._id,
            operator: "anonymous",
            metadata: {
                ip: req.ip,
                userAgent: req.headers["user-agent"],
                updatedFields: req.body,
            },
        });

        res.json({
            success: true,
            message: "Event template updated successfully",
            data: template,
        });
    } catch (error) {
        next(error);
    }
}

async function deleteTemplate(req, res, next) {
    try {
        await templateService.deleteTemplate(req.params.id);

        await auditLogService.createAuditLog({
            action: "DELETE_EVENT_TEMPLATE",
            entityType: "EVENT_TEMPLATE",
            entityId: req.params.id,
            operator: "anonymous",
            metadata: {
                ip: req.ip,
                userAgent: req.headers["user-agent"],
            },
        });

        res.json({
            success: true,
            message: "Event template deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createTemplate,
    getAllTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
};