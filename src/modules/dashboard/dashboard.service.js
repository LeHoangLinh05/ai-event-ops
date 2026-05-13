const Event = require("../events/event.model");
const EventTemplate = require("../event-templates/event-template.model");
const AuditLog = require("../audit-logs/audit-log.model");
const AiGeneration = require("../ai/ai.model");

async function getDashboardSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
        totalEvents,
        draftEvents,
        reviewedEvents,
        publishedEvents,
        totalTemplates,
        totalAuditLogs,
        totalAiGenerations,
        aiGenerationsToday,

        latestEvents,
        latestAuditLogs,
    ] = await Promise.all([
        Event.countDocuments(),
        Event.countDocuments({ status: "draft" }),
        Event.countDocuments({ status: "reviewed" }),
        Event.countDocuments({ status: "published" }),
        EventTemplate.countDocuments(),
        AuditLog.countDocuments(),
        AiGeneration.countDocuments({ status: "success" }),
        AiGeneration.countDocuments({
            status: "success",
            createdAt: { $gte: today }
        }),
        Event.find().sort({ createdAt: -1 }).limit(3),
        AuditLog.find().sort({ createdAt: -1 }).limit(3),
    ]);

    return {
        totalEvents,
        draftEvents,
        publishedEvents,
        aiGenerationsToday,
        latestEvents,
        latestAuditLogs,
    };
}

module.exports = {
    getDashboardSummary,
};