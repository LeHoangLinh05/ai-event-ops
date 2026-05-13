const eventRepository = require("./event.repository");
const ERROR_CODES = require("../../shared/errors/errorCodes");
const AppError = require("../../shared/errors/AppError");

async function createEvent(data) {
    const payload = {
        ...data,
        eventCode: data.eventCode || `EVT_${Date.now()}`,
        status: data.status || "draft",
        inputJson: data.inputJson || data,
    };

    return await eventRepository.createEvent(payload);
}

async function getAllEvents(query) {
    const {
        keyword,
        status,
        eventType,
        theme,
        targetSegment,
        page = 1,
        limit = 10,
    } = query;

    const filter = {};

    if (keyword) {
        filter.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
            { eventCode: { $regex: keyword, $options: "i" } },
        ];
    }

    if (status) {
        filter.status = status;
    }

    if (eventType) {
        filter.eventType = eventType;
    }

    if (theme) {
        filter.theme = theme;
    }

    if (targetSegment) {
        filter.targetSegment = targetSegment;
    }

    const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { createdAt: -1 },
    };

    return await eventRepository.findAllEvents(filter, options);
}

async function getEventById(id) {
    const event = await eventRepository.findEventById(id);

    if (!event) {
        throw new AppError("Event not found", 404, ERROR_CODES.NOT_FOUND);
    }

    return event;
}

async function updateEvent(id, data) {
    const event = await eventRepository.updateEventById(id, data);

    if (!event) {
        throw new AppError("Event not found", 404, ERROR_CODES.NOT_FOUND);
    }

    return event;
}

async function deleteEvent(id) {
    const event = await eventRepository.deleteEventById(id);

    if (!event) {
        throw new AppError("Event not found", 404, ERROR_CODES.NOT_FOUND);
    }

    return event;
}

async function publishEvent(id) {

    if (!id) {
        throw new AppError("Event ID is required", 400, ERROR_CODES.VALIDATION_ERROR);
    }

    return await updateEvent(id, {
        status: "published",
    });
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    publishEvent,
};