import { addKeyword, EVENTS } from "@builderbot/bot";
import { orderFlow } from "./order_flow";
import { handlerAI } from "../services/whisper";
import AIService from "~/services/ai_service";
import { config } from "~/config";
import path from "path";
import fs from "fs";

const pathPrompt = path.join(
  process.cwd(),
  "assets/prompts",
  "prompt_openai.txt"
);
const prompt = fs.readFileSync(pathPrompt, "utf8");

const voiceFlow = addKeyword(EVENTS.VOICE_NOTE).addAnswer(
  `Escuchando...`,
  null,
  async (ctx, ctxFn) => {
    const text = await handlerAI(ctx);
    console.log(`El usuario dice: ${text}`);
    const mensajesActuales = [{ role: "user", content: text }];
    const response = await AIService.chat(prompt, mensajesActuales);
    // const response = await generateResponse(prompt);
    await ctxFn.flowDynamic(response);
  }
);

export { voiceFlow };
