const { body } = require("express-validator");

const generateEventValidation = [
    body("eventType").notEmpty().withMessage("eventType is required"),
    body("theme").notEmpty().withMessage("theme is required"),
    body("targetSegment").notEmpty().withMessage("targetSegment is required"),
    body("duration").isNumeric().withMessage("duration must be a number"),
    body("reward").notEmpty().withMessage("reward is required"),
    body("tone").notEmpty().withMessage("tone is required"),
];

const regenerateFieldValidation = [
    body("field").notEmpty().withMessage("field is required"),
    body("context").notEmpty().withMessage("context is required"),
];

module.exports = {
    generateEventValidation,
    regenerateFieldValidation,
};
