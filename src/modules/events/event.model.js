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
            required: true,
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
            type: [
                {
                    title: String,
                    description: String,
                },
            ],
            default: [],
        },

        rewardSuggestion: {
            type: [
                {
                    itemName: String,
                    quantity: Number,
                    rarity: String,
                },
            ],
            default: [],
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