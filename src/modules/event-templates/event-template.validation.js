const { body } = require("express-validator");

const createTemplateValidation = [
    body("name")
        .notEmpty()
        .withMessage("name is required"),

    body("eventType")
        .notEmpty()
        .withMessage("eventType is required"),

    body("defaultReward")
        .optional()
        .isObject()
        .withMessage("defaultReward must be an object"),
];

const updateTemplateValidation = [
    body("name")
        .optional()
        .notEmpty()
        .withMessage("name cannot be empty"),

    body("eventType")
        .optional()
        .notEmpty()
        .withMessage("eventType cannot be empty"),

    body("defaultReward")
        .optional()
        .isObject()
        .withMessage("defaultReward must be an object"),
];

module.exports = {
    createTemplateValidation,
    updateTemplateValidation,
};