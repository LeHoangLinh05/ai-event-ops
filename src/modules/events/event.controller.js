const eventService = require("./event.service");
const auditLogService = require("../audit-logs/audit-log.service");

async function createEvent(req, res, next) {
    try {
        const event = await eventService.createEvent(req.body);

        await auditLogService.createAuditLog({
            action: "CREATE_EVENT",
            entityType: "EVENT",
            entityId: event._id,
            operator: "anonymous",
            metadata: {
                ip: req.ip,
                userAgent: req.headers["user-agent"],
                requestBody: req.body,
            },
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event,
        });
    } catch (error) {
        next(error);
    }
}

async function getAllEvents(req, res, next) {
    try {
        const result = await eventService.getAllEvents(req.query);

        res.json({
            success: true,
            data: result.events,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
}

async function getEventById(req, res, next) {
    try {
        const event = await eventService.getEventById(req.params.id);

        res.json({
            success: true,
            data: event,
        });
    } catch (error) {
        next(error);
    }
}

async function updateEvent(req, res, next) {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body);

        await auditLogService.createAuditLog({
            action: "UPDATE_EVENT",
            entityType: "EVENT",
            entityId: event._id,
            operator: "anonymous",
            metadata: {
                ip: req.ip,
                userAgent: req.headers["user-agent"],
                updatedFields: req.body,
            },
        });

        res.json({
            success: true,
            message: "Event updated successfully",
            data: event,
        });
    } catch (error) {
        next(error);
    }
}

async function deleteEvent(req, res, next) {
    try {
        const event = await eventService.getEventById(req.params.id);
        await eventService.deleteEvent(req.params.id);

        await auditLogService.createAuditLog({
            action: "DELETE_EVENT",
            entityType: "EVENT",
            entityId: event._id,
            operator: "anonymous",
            metadata: {
                ip: req.ip,
                userAgent: req.headers["user-agent"],
            },
        });

        res.json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

async function publishEvent(req, res, next) {
    try {
        const event = await eventService.publishEvent(req.params.id);

        await auditLogService.createAuditLog({
            action: "PUBLISH_EVENT",
            entityType: "EVENT",
            entityId: event._id,
            operator: "anonymous",
            metadata: {
                ip: req.ip,
                userAgent: req.headers["user-agent"],
            },
        });

        res.json({
            success: true,
            message: "Event published successfully",
            data: event,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    publishEvent,
};