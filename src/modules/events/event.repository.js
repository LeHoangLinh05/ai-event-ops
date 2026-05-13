const Event = require("./event.model");

async function createEvent(data) {
    return await Event.create(data);
}

async function findAllEvents(filter, options) {
    const { page, limit, sort } = options;

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
        Event.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit),

        Event.countDocuments(filter),
    ]);

    return {
        events,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

async function findEventById(id) {
    return await Event.findById(id);
}

async function updateEventById(id, data) {
    return await Event.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
}

async function deleteEventById(id) {
    return await Event.findByIdAndDelete(id);
}

module.exports = {
    createEvent,
    findAllEvents,
    findEventById,
    updateEventById,
    deleteEventById,
};