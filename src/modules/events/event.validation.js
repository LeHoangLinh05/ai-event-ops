const { body } = require("express-validator");

const createEventValidation = [
    body("eventType")
        .notEmpty()
        .withMessage("eventType is required"),

    body("duration")
        .optional()
        .isNumeric()
        .withMessage("duration must be a number"),

    body("rules")
        .optional()
        .isArray()
        .withMessage("rules must be an array"),

    body("status")
        .optional()
        .isIn(["draft", "reviewed", "published"])
        .withMessage("status must be draft, reviewed, or published"),
];

const updateEventValidation = [
    body("duration")
        .optional()
        .isNumeric()
        .withMessage("duration must be a number"),

    body("rules")
        .optional()
        .isArray()
        .withMessage("rules must be an array"),

    body("rewardSuggestion")
        .optional()
        .isArray()
        .withMessage("rewardSuggestion must be an array"),

    body("status")
        .optional()
        .isIn(["draft", "reviewed", "published"])
        .withMessage("status must be draft, reviewed, or published"),
];

module.exports = {
    createEventValidation,
    updateEventValidation,
};