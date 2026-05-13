const mongoose = require("mongoose");

const aiGenerationSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            default: null,
        },

        prompt: {
            type: String,
            required: true,
        },

        modelName: {
            type: String,
            default: "",
        },

        responseJson: {
            type: Object,
            default: {},
        },

        status: {
            type: String,
            enum: ["success", "failed"],
            default: "success",
        },

        errorMessage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AiGeneration", aiGenerationSchema);