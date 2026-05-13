const AiGeneration = require("./ai.model");

class AiRepository {
    async createLog(data) {
        return await AiGeneration.create(data);
    }

    async getStats() {
        const totalGenerations = await AiGeneration.countDocuments({ status: "success" });
        return { totalGenerations };
    }
}

module.exports = new AiRepository();
