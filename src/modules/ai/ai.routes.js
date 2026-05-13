const express = require("express");
const aiController = require("./ai.controller");
const aiValidation = require("./ai.validation");
const validate = require("../../shared/middlewares/validate.middleware");

const router = express.Router();

router.post(
    "/generate-event",
    aiValidation.generateEventValidation,
    validate,
    aiController.generateEvent
);

router.post(
    "/regenerate-field",
    aiValidation.regenerateFieldValidation,
    validate,
    aiController.regenerateField
);

module.exports = router;
