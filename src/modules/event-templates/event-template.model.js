const mongoose = require("mongoose");

const eventTemplateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        eventType: {
            type: String,
            required: true,
            trim: true,
        },

        defaultTheme: {
            type: String,
            default: "",
        },

        defaultTargetSegment: {
            type: String,
            default: "",
        },

        defaultReward: {
            type: Object,
            default: {},
        },

        defaultTone: {
            type: String,
            default: "",
        },

        templatePrompt: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("EventTemplate", eventTemplateSchema);