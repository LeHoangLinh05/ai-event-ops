const templateRepository = require("./event-template.repository");
const ERROR_CODES = require("../../shared/errors/errorCodes");
const AppError = require("../../shared/errors/AppError");

async function createTemplate(data) {
    return await templateRepository.createTemplate(data);
}

async function getAllTemplates() {
    return await templateRepository.findAllTemplates();
}

async function getTemplateById(id) {
    const template = await templateRepository.findTemplateById(id);

    if (!template) {
        throw new AppError("Event template not found", 404, ERROR_CODES.NOT_FOUND);
    }

    return template;
}

async function updateTemplate(id, data) {
    const template = await templateRepository.updateTemplateById(id, data);

    if (!template) {
        throw new AppError("Event template not found", 404, ERROR_CODES.NOT_FOUND);
    }

    return template;
}

async function deleteTemplate(id) {
    const template = await templateRepository.deleteTemplateById(id);

    if (!template) {
        throw new AppError("Event template not found", 404, ERROR_CODES.NOT_FOUND);
    }

    return template;
}

module.exports = {
    createTemplate,
    getAllTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
};