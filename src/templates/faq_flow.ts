import { addKeyword, EVENTS } from "@builderbot/bot";
import AIService from "../services/ai_service";
import { config } from "../config";
import path from "path";
import fs, { stat } from "fs";

const pathPrompt = path.join(
  process.cwd(),
  "assets/prompts",
  "prompt_openai.txt"
);
const prompt = fs.readFileSync(pathPrompt, "utf8");

export const faqFlow = addKeyword(EVENTS.ACTION).addAction(async (ctx, { state, endFlow, gotoFlow }) => {
    try {
        const AI = new AIService(config.apiKeyAI)
        const response = await AI.chat(prompt, [{role: 'user', content: ctx.body}])
        return endFlow(response)
    } catch (error) {
        console.error('Error in faqFlow:', error)
        return endFlow('Por favor, intenta de nuevo')
    }
});