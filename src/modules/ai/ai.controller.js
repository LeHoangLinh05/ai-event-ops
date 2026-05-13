const aiService = require("./ai.service");

async function generateEvent(req, res, next) {
    try {
        const { eventType, theme, targetSegment, duration, reward, tone } = req.body;
        
        const content = await aiService.generateEventContent({
            eventType,
            theme,
            targetSegment,
            duration,
            reward,
            tone
        });

        res.json({
            success: true,
            data: content
        });
    } catch (error) {
        next(error);
    }
}

async function regenerateField(req, res, next) {
    try {
        const { field, context } = req.body;
        
        const content = await aiService.regenerateField({ field, context });

        res.json({
            success: true,
            data: content
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    generateEvent,
    regenerateField
};
