import { addKeyword, EVENTS } from "@builderbot/bot";
import AIService from "../services/ai_service";
import path from "path";
import fs from "fs";
import patioServiceApi from "~/services/patio_service_api";
import Constants from "~/utils/constants";
import MerchantUtils from "~/utils/merchant_near";
import { finishOrderFlow } from "./finish_order_flow";
import LocalStorage from "~/services/local_storage";
import ProductUtils from "~/utils/parse_products";
import Utils from "~/utils/utils";
import { AIResponse, AIResponseFinish } from "~/models/ai_flow.model";
import { config } from "~/config";
const pathPrompt = path.join(
  process.cwd(),
  "assets/prompts",
  config.providerAssetsOrder,
  "prompt_ai_order.txt"
);
const prompt = fs.readFileSync(pathPrompt, "utf8");

const pathPromptFormat = path.join(
  process.cwd(),
  "assets/prompts",
  "prompt_format_order.txt"
);
const promptFormat = fs.readFileSync(pathPromptFormat, "utf8");

const pathPromptFinish = path.join(
  process.cwd(),
  "assets/prompts",
  "promt_finish_order.txt"
);
const promptFinish = fs.readFileSync(pathPromptFinish, "utf8");

export const orderFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, endFlow, gotoFlow, globalState }) => {
    state.update({ isProcessingAI: true });

    try {
      try {
        const menuGlobal = await LocalStorage.getMenu(state)
        const menuProducts = ProductUtils.productsParseText(
          JSON.parse(menuGlobal as string)
        );
        let newPrompt =
          prompt + "\nEl menu es: " + menuProducts + "\n" + promptFormat;
        let messages = [
          ...(state.get("messages") || []),
          { role: "user", content: ctx.body },
        ];
        const response = await AIService.chat(newPrompt, messages);
        messages = [...messages, { role: "assistant", content: response }];
        const responseParse = Utils.fixJSON(response) as AIResponse;
        console.log("response", responseParse);

        await LocalStorage.saveOrderCurrent(state, {
          id: 1,
          status: "pending",
        });
        let merchants = await LocalStorage.getMerchantsNearByUser(state);
        const userAddress = await LocalStorage.getAddressCurrent(state);
        if (!merchants) {
          merchants = await MerchantUtils.orderMerchantByDistanceUser(
            globalState,
            state
          );
        }

        let deliveryCost = (await state.get("deliveryCost")) as number | undefined;
        if (!deliveryCost) {
          let currency = (await state.get("currency")) as string;
          const res = await patioServiceApi.getQuote({
            merchantId: merchants[0].id,
            fromLatitude: merchants[0].latitude,
            fromLongitude: merchants[0].longitude,
            toLatitude: userAddress.latitude,
            toLongitude: userAddress.longitude,
            returnRoute: 0,
            vehicleTypeId: Constants.vehicleType_motorcycle,
            cityId: Constants.cityId_SC,
          });
          deliveryCost = res.baseCost ?? 0 + res.extraCost ?? 0;
          currency = res.currency;
          const msgDeliveryCost = `El servicio de envío es de ${deliveryCost} ${currency}, tarifa calculada desde la sucursal de ${merchants[0].name}. Actualmente no aceptamos pedidos para retiro en el local y solo aceptamos pedidos a domicilio. Tampoco podemos cambiar la sucursal, se calcula desde la sucursal mas cercana.`;
          state.update({
            messages: [
              ...messages,
              { role: "system", content: msgDeliveryCost },
            ],
          });
        } else {
          state.update({
            messages: [...messages],
          });
        }

        if (responseParse.cancel_order) {
          await LocalStorage.clearOrderCurrent(state);
          return endFlow(responseParse.message.body || "No hay problema, espero que vuelvas pronto");
        }

        if (responseParse.is_finish) {
          messages = [...messages, { role: "system", content: promptFinish }];
          const responseFinish = await AIService.chat(newPrompt, messages);
          const responseParse = Utils.fixJSON(
            responseFinish
          ) as AIResponseFinish;
          console.log("products", responseParse.products);

          if (responseParse.products.length === 0) {
            return endFlow("No hemos registrado ningun producto en tu pedido");
          }
          await flowDynamic("Realizando pedido... un momento por favor", {
            delay: Constants.delayMessage,
          });
          LocalStorage.clearOrderCurrent(state);
          state.update({
            messages: [],
            deliveryCost: undefined,
            products: responseParse.products,
          });
          return gotoFlow(finishOrderFlow);
        }
        
        let sendMessage: any = responseParse.message.body;
        if (responseParse.message.media && responseParse.message.media !== "") {
          sendMessage = [
            {
              body: responseParse.message.body,
              media: responseParse.message.media,
            },
          ];
        }
        return flowDynamic(sendMessage, {
          delay: Constants.delayMessage,
        });
      } catch (error) {
        console.error("Error in faqFlow:", error);
        return endFlow("Por favor, intenta de nuevo");
      } finally {
        state.update({ isProcessingAI: false });
      }
    } catch (error) {
      console.error("Error in faqFlow:", error);
      return endFlow("Por favor, intenta de nuevo");
    }
  }
);
