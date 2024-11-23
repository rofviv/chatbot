import { addKeyword, EVENTS } from "@builderbot/bot";
import AIService from "../services/ai_service";
import path from "path";
import fs from "fs";
import { clearOrderCurrent } from "~/services/local_storage";
const pathPrompt = path.join(
  process.cwd(),
  "assets/prompts",
  "prompt_empanada_ai.txt"
);
const prompt = fs.readFileSync(pathPrompt, "utf8");

export const empanadaFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, endFlow }) => {
    try {
      let messages = [
        ...(state.get("messages") || []),
        { role: "user", content: ctx.body },
      ];
      if (ctx.body === "reset") {
        state.update({ messages: [] });
        return endFlow("Resetting conversation.... Ok");
      }
      const response = await AIService.chat(prompt, messages);
      state.update({ messages: [...messages, { role: "assistant", content: response }] });
      console.log("msg: ", messages);
      return flowDynamic(response);
    } catch (error) {
      return endFlow("Sorry, try again");
    }
  }
);

