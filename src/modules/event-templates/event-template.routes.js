const express = require("express");
const templateController = require("./event-template.controller");

const {
    createTemplateValidation,
    updateTemplateValidation,
} = require("./event-template.validation");

const validateRequest = require("../../shared/middlewares/validate.middleware");

const router = express.Router();

router.post(
    "/",
    createTemplateValidation,
    validateRequest,
    templateController.createTemplate
);

router.get("/", templateController.getAllTemplates);
router.get("/:id", templateController.getTemplateById);

router.put(
    "/:id",
    updateTemplateValidation,
    validateRequest,
    templateController.updateTemplate
);

router.delete("/:id", templateController.deleteTemplate);

module.exports = router;