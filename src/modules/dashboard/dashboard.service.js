const Event = require("../events/event.model");
const EventTemplate = require("../event-templates/event-template.model");
const AuditLog = require("../audit-logs/audit-log.model");

async function getDashboardSummary() {
    const [
        totalEvents,
        draftEvents,
        reviewedEvents,
        publishedEvents,
        totalTemplates,
        totalAuditLogs,
    ] = await Promise.all([
        Event.countDocuments(),
        Event.countDocuments({ status: "draft" }),
        Event.countDocuments({ status: "reviewed" }),
        Event.countDocuments({ status: "published" }),
        EventTemplate.countDocuments(),
        AuditLog.countDocuments(),
    ]);

    return {
        events: {
            total: totalEvents,
            draft: draftEvents,
            reviewed: reviewedEvents,
            published: publishedEvents,
        },

        templates: {
            total: totalTemplates,
        },

        auditLogs: {
            total: totalAuditLogs,
        },
    };
}

module.exports = {
    getDashboardSummary,
};