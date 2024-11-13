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

export const orderFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, endFlow, gotoFlow }) => {
    try {
      const AI = new AIService(config.apiKeyAI);
      const mensajesAnteriores = state.getMyState()?.messages || [];
      const mensajesActuales = [
        ...mensajesAnteriores,
        { role: "user", content: ctx.body },
      ];
      console.log("mensajes", mensajesActuales);
      const response = await AI.chat(prompt, mensajesActuales);
      state.update({ messages: mensajesActuales });
      return endFlow(response);
    } catch (error) {
      console.error("Error in faqFlow:", error);
      return endFlow("Por favor, intenta de nuevo");
    }
  }
);