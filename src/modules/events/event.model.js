const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        eventCode: {
            type: String,
            unique: true,
            trim: true,
        },

        title: {
            type: String,
            default: "",
            trim: true,
        },

        eventType: {
            type: String,
            required: true,
            trim: true,
        },

        theme: {
            type: String,
            default: "",
        },

        targetSegment: {
            type: String,
            default: "",
        },

        duration: {
            type: Number,
            default: 0,
        },

        startDate: {
            type: Date,
            default: null,
        },

        endDate: {
            type: Date,
            default: null,
        },

        reward: {
            type: String,
            default: "",
        },

        tone: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },

        pushMessage: {
            type: String,
            default: "",
        },

        rules: {
            type: [String],
            default: [],
        },

        rewardSuggestion: {
            type: String,
            default: "",
        },

        aiContent: {
            type: Object,
            default: {},
        },

        status: {
            type: String,
            enum: ["draft", "reviewed", "published"],
            default: "draft",
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Event", eventSchema);