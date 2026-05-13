const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
        },

        entityType: {
            type: String,
            required: true,
        },

        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        operator: {
            type: String,
            default: "anonymous",
        },

        metadata: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);