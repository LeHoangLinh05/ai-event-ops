const EventTemplate = require("./event-template.model");

async function createTemplate(data) {
    return await EventTemplate.create(data);
}

async function findAllTemplates() {
    return await EventTemplate.find().sort({ createdAt: -1 });
}

async function findTemplateById(id) {
    return await EventTemplate.findById(id);
}

async function updateTemplateById(id, data) {
    return await EventTemplate.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
}

async function deleteTemplateById(id) {
    return await EventTemplate.findByIdAndDelete(id);
}

module.exports = {
    createTemplate,
    findAllTemplates,
    findTemplateById,
    updateTemplateById,
    deleteTemplateById,
};