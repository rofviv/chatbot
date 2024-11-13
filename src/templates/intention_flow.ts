import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import { config } from "../config";
import path from "path";
import fs from "fs";
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

const menuPath = path.join(process.cwd(), "assets/messages", "menu.txt");

const promptDetected = fs.readFileSync(promptIntentionDetection, "utf8");
const menuText = fs.readFileSync(menuPath, "utf8");

export const intentionFlow = createFlowRouting
  .setKeyword(EVENTS.ACTION)
  .setIntentions({
    intentions: [
      "GREETING",
      "CREATE_ORDER",
      "PRODUCTS",
      "STATUS_ORDER",
      "CANCEL_ORDER",
      "NO_DETECTED",
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
            return endFlow(menuText);
          }

          if (intention === "GREETING") {
            return endFlow(
              "Hola! soy un bot que te puede ayudar a realizar tus pedidos\n\n" +
                menuText
            );
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
