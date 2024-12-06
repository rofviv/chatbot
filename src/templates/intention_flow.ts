import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import { config } from "../config";
import path from "path";
import fs from "fs";
import { orderFlow } from "./order_flow";
import { getStatusOrderFlow } from "./order_status_flow";
import { cancelOrderFlow } from "./order_cancel_flow";
import { addressFlow } from "./address_flow";
// import { registerFlow } from "./register_flow";
import LocalStorage from "~/services/local_storage";
import { formRegisterFlow } from "./register_flow";
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
      // "GREETING",
      "CREATE_ORDER",
      "MENU",
      "STATUS_ORDER",
      "CANCEL_ORDER",
      "QUESTION_LOCATION",
      // "END_FLOW",
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
      return flow.addAction(
        async (ctx, { state, endFlow, gotoFlow }) => {
          try {
            const intention = await state.get("intention");
            console.log("Intention detected: ", intention);

            if (intention === "CREATE_ORDER" || ctx.body == "1") {
              const currentUser = await LocalStorage.getUser(state);
              if (!currentUser) {
                // const registerPosponed = await LocalStorage.getRegisterPosponed(state);
                // if (!registerPosponed) {
                  return gotoFlow(formRegisterFlow);
                // } else {
                //   const address = await LocalStorage.getAddressCurrent(state);
                //   if (address) {
                //     ctx.body = "Muestrame el menu";
                //     return gotoFlow(orderFlow);
                //   } else {
                //     await state.update({
                //       onlyAddress: true,
                //     });
                //     return gotoFlow(addressFlow);
                //   }
                // }
              } else {
                if (
                  currentUser &&
                  currentUser.data.addresses &&
                  currentUser.data.addresses.length > 0
                ) {
                  const currentAddress = await LocalStorage.getAddressCurrent(state);
                  if (!currentAddress) {
                    await LocalStorage.saveAddressCurrent(
                      state,
                      currentUser.data.addresses[0],
                    );
                  }
                  await state.update({
                    verifyAddress: true,
                  });
                  return gotoFlow(orderFlow);
                } else {
                  return gotoFlow(addressFlow);
                }
              }
            }

            if (intention === "MENU" || ctx.body == "2") {
              ctx.body = "Muestrame el menu";
              const userAddress = await LocalStorage.getAddressCurrent(state);
              if (userAddress) {
                return gotoFlow(orderFlow);
              } else {
                await state.update({
                  onlyAddress: true,
                });
                return gotoFlow(addressFlow);
              }
            }

            if (intention === "STATUS_ORDER" || ctx.body == "3") {
              return gotoFlow(getStatusOrderFlow);
            }

            if (intention === "CANCEL_ORDER" || ctx.body == "4") {
              return gotoFlow(cancelOrderFlow);
            }

            if (intention === "QUESTION_LOCATION") {
              return endFlow("La ubicación es necesaria para verificar si hay cobertura en tu zona y para calcular el costo de envío, es necesario que nos compartas tu ubicación");
            }

            // if (intention === "GREETING") {
            //   return endFlow(menuText);
            // }

            // if (intention === "END_FLOW") {
            //   return endFlow(menuText);
            // }

            return endFlow(menuText);
          } catch (error) {
            console.error("Error in intentionFlow:", error);
          }
        }
      );
    },
  });
