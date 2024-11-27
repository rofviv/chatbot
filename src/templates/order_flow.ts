import { addKeyword, EVENTS } from "@builderbot/bot";
import AIService from "../services/ai_service";
import path from "path";
import fs from "fs";
import { intentionFlow } from "./intention_flow";
import { productsParseText } from "~/utils/parse_products";
import { i18n } from "~/translations";
import { saveOrderCurrent, clearOrderCurrent } from "~/services/local_storage";

const pathPrompt = path.join(
  process.cwd(),
  "assets/prompts",
  "prompt_ai_order.txt"
);
const prompt = fs.readFileSync(pathPrompt, "utf8");

export const orderFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, endFlow, gotoFlow, globalState }) => {
    // CONFIGURE INTENTION DETECTION ORDER FLOW
    try {
      saveOrderCurrent(state, { id: 1, status: "pending" });
      let messages = [
        ...(state.get("messages") || []),
        { role: "user", content: ctx.body },
      ];
      if (
        ctx.body.toLowerCase() === i18n.t("hello").toLowerCase() ||
        ctx.body.toLowerCase() === i18n.t("menu").toLowerCase()
      ) {
        clearOrderCurrent(state);
        return gotoFlow(intentionFlow);
      }
      if (ctx.body.toLowerCase() === "finalizar" || ctx.body.toLowerCase() === "realizar mi pedido") {
        // CREATE ORDER
        clearOrderCurrent(state);
        return flowDynamic("Creando tu pedido, por favor espera...");
      }
      const products = productsParseText(JSON.parse(globalState.get("menuGlobal") as string));
      const newPrompt = prompt + "\nEl menu es: " + products;
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

