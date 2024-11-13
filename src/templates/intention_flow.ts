import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import { config } from "../config";
import path from "path";
import fs from "fs";
import { optionsFlow } from "./options_flow";
import {
  orderFlow,
  getStatusOrderFlow,
  cancelOrderFlow,
  productsFlow,
} from "./order_flow";

const promptIntentionDetection = path.join(
  process.cwd(),
  "assets/prompts",
  "promt_intention_detection.txt"
);

const promptDetected = fs.readFileSync(promptIntentionDetection, "utf8");

export const intentionFlow = createFlowRouting
  .setKeyword(EVENTS.ACTION)
  .setIntentions({
    intentions: [
      "OPTIONS",
      "CREATE_ORDER",
      "PRODUCTS",
      "STATUS_ORDER",
      "CANCEL_ORDER",
    ],
    description: promptDetected,
  })
  .setAIModel({
    modelName: "openai" as any,
    args: {
      modelName: config.model,
      apikey: config.apiKeyAI,
    },
  })
  .create({
    afterEnd(flow) {
      return flow.addAction(async (ctx, { state, endFlow, gotoFlow }) => {
        try {
          const intention = await state.get("intention");
          console.log("Intention detected: ", intention);

          if (intention === "NO_DETECTED") {
            return endFlow(
              "Lo siento, no pude entender tu mensaje. Por favor, intenta nuevamente."
            );
          }

          if (intention === "OPTIONS") {
            return gotoFlow(optionsFlow);
          }

          if (intention === "PRODUCTS") {
            return gotoFlow(productsFlow);
          }

          if (intention === "CREATE_ORDER") {
            return gotoFlow(orderFlow);
          }

          if (intention === "STATUS_ORDER") {
            return gotoFlow(getStatusOrderFlow);
          }

          if (intention === "CANCEL_ORDER") {
            return gotoFlow(cancelOrderFlow);
          }
        } catch (error) {
          console.error("Error in intentionFlow:", error);
        }
      });
    },
  });
