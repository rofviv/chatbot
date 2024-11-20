import { addKeyword, EVENTS } from "@builderbot/bot";
import AIService from "../services/ai_service";
import { config } from "../config";
import path from "path";
import fs, { stat } from "fs";
import { intentionFlow } from "./intention_flow";
import { productsParseText } from "~/utils/parse_products";

const pathPrompt = path.join(
  process.cwd(),
  "assets/prompts",
  "prompt_ai_order.txt"
);
const prompt = fs.readFileSync(pathPrompt, "utf8");

export const orderFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, endFlow, gotoFlow, globalState }) => {
    try {
      state.update({ order: { id: 1, status: "pending" } });
      let messages = [
        ...(state.get("messages") || []),
        { role: "user", content: ctx.body },
      ];
      if (
        ctx.body.toLowerCase() === "salir" ||
        ctx.body.toLowerCase() === "cancelar"
      ) {
        state.update({ messages: [], order: undefined });
        return gotoFlow(intentionFlow);
      }
      if (ctx.body.toLowerCase() === "finalizar" || ctx.body.toLowerCase() === "realizar mi pedido") {
        // CREATE ORDER
        state.update({ messages: [], order: undefined });
        return flowDynamic("Creando tu pedido, por favor espera...");
      }
      const products = productsParseText(JSON.parse(globalState.get("menuGlobal") as string));
      const newPrompt = prompt + "\nLo que puedes ofrecerle es: " + products;
      const response = await AIService.chat(newPrompt, messages);
      state.update({ messages: [...messages, { role: "assistant", content: response }] });
      console.log("mensajes", messages);
      return flowDynamic(response);
    } catch (error) {
      console.error("Error in faqFlow:", error);
      return endFlow("Por favor, intenta de nuevo");
    }
  }
);

