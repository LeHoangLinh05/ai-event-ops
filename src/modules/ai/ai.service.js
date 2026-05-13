const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require("../../config/env.config");
const aiRepository = require("./ai.repository");

class AiService {
    constructor() {
        if (env.GEMINI_API_KEY) {
            this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({ 
                model: env.GEMINI_MODEL,
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });
        }
    }

    async generateEventContent(data) {
        if (!this.genAI) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const prompt = `
            You are a game operation assistant. 
            Generate concise and practical event content based on the following input:
            - Event Type: ${data.eventType}
            - Theme: ${data.theme}
            - Target Segment: ${data.targetSegment}
            - Duration: ${data.duration} days${data.startDate ? ` (Start: ${data.startDate}, End: ${data.endDate})` : ''}
            - Reward: ${data.reward}
            - Tone: ${data.tone}

            Return JSON only with the following structure:
            {
                "title": "event title",
                "description": "event description",
                "pushMessage": "push notification message",
                "rules": ["rule 1", "rule 2"],
                "rewardSuggestion": "suggestion for rewards"
            }
            
            IMPORTANT:
            - Return valid JSON.
            - No markdown formatting.
            - No explanation text.
            - Rules should be an array of strings.
            - USE THE ACTUAL DATES provided above (${data.startDate} to ${data.endDate}) in the description and rules if applicable. 
            - DO NOT use placeholders like [Start Date], [End Date], or [Duration]. Fill them with real values.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            console.log("AI Raw Response:", text);

            let jsonResponse;
            try {
                jsonResponse = JSON.parse(text);
            } catch (e) {
                // Fallback: try to strip markdown if AI included it despite instructions
                const cleanedText = text.replace(/```json|```/g, "").trim();
                jsonResponse = JSON.parse(cleanedText);
            }

            console.log("AI Parsed JSON:", jsonResponse);

            // Log successful generation
            await aiRepository.createLog({
                prompt: prompt,
                modelName: env.GEMINI_MODEL,
                responseJson: jsonResponse,
                status: "success"
            });

            return jsonResponse;
        } catch (error) {
            // Log failed generation
            await aiRepository.createLog({
                prompt: prompt,
                modelName: env.GEMINI_MODEL,
                status: "failed",
                errorMessage: error.message
            });
            throw error;
        }
    }

    async regenerateField(data) {
        if (!this.genAI) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const { field, context } = data;
        const isArrayField = field === "rules";
        const valueExample = isArrayField
            ? `["rule 1", "rule 2", "rule 3"]`
            : `"new generated content"`;

        const prompt = `
            You are a game operation assistant.
            Regenerate the "${field}" for a game event with the following context:
            ${JSON.stringify(context, null, 2)}

            Return JSON only with the following structure:
            {
                "${field}": ${valueExample}
            }

            IMPORTANT:
            - Return valid JSON.
            - No markdown formatting.
            - No explanation text.
            ${isArrayField ? "- rules MUST be a JSON array of strings, not a single string." : ""}
            - USE THE ACTUAL DATES provided in the context (${context.startDate} to ${context.endDate}) if relevant.
            - DO NOT use placeholders like [Start Date] or [End Date].
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            let jsonResponse;
            try {
                jsonResponse = JSON.parse(text);
            } catch (e) {
                const cleanedText = text.replace(/```json|```/g, "").trim();
                jsonResponse = JSON.parse(cleanedText);
            }

            // Log successful generation
            await aiRepository.createLog({
                prompt: prompt,
                modelName: env.GEMINI_MODEL,
                responseJson: jsonResponse,
                status: "success"
            });

            return jsonResponse;
        } catch (error) {
            await aiRepository.createLog({
                prompt: prompt,
                modelName: env.GEMINI_MODEL,
                status: "failed",
                errorMessage: error.message
            });
            throw error;
        }
    }
}

module.exports = new AiService();
