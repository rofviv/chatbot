import { addKeyword, EVENTS } from "@builderbot/bot";
import AIService from "../services/ai_service";
import path from "path";
import fs from "fs";
import { intentionFlow } from "./intention_flow";
import { i18n } from "~/translations";
import patioServiceApi from "~/services/patio_service_api";
import Constants from "~/utils/constants";
import MerchantUtils from "~/utils/merchant_near";
import { finishOrderFlow } from "./finish_order_flow";
import LocalStorage from "~/services/local_storage";
import ProductUtils from "~/utils/parse_products";
import Utils from "~/utils/utils";
import { AIResponse, AIResponseFinish } from "~/models/ai_flow.model";

const pathPrompt = path.join(
  process.cwd(),
  "assets/prompts",
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
    try {
      LocalStorage.saveOrderCurrent(state, { id: 1, status: "pending" });
      let merchants = await LocalStorage.getMerchantsNearByUser(state);
      const userAddress = await LocalStorage.getAddressCurrent(state);
      if (!merchants) {
        const merchantsGlobal = await LocalStorage.getMerchantsGlobal(
          globalState
        );
        const merchantsNear = await MerchantUtils.merchantNear(
          merchantsGlobal,
          userAddress.latitude,
          userAddress.longitude
        );
        await LocalStorage.saveMerchantsNearByUser(state, merchantsNear);
        merchants = await LocalStorage.getMerchantsNearByUser(state);
      }
      let messages = [
        ...(state.get("messages") || []),
        { role: "user", content: ctx.body },
      ];
      if (
        ctx.body.toLowerCase() === i18n.t("hello").toLowerCase() ||
        ctx.body.toLowerCase() === i18n.t("menu").toLowerCase() ||
        ctx.body.toLowerCase() === "salir"
      ) {
        LocalStorage.clearOrderCurrent(state);
        return gotoFlow(intentionFlow);
      }
      const products = ProductUtils.productsParseText(
        JSON.parse(globalState.get("menuGlobal") as string)
      );
      const categories = ProductUtils.parseCategories(
        JSON.parse(globalState.get("menuGlobal") as string)
      );
      let newPrompt = prompt + "\nEl menu es: " + products;
      if (state.get("deliveryCost")) {
        newPrompt +=
          "\nEl costo de envío es de " +
          state.get("deliveryCost") +
          " " +
          (state.get("currency") || "BOB");
      }
      newPrompt += "\n" + promptFormat;
      const response = await AIService.chat(newPrompt, messages);
      state.update({
        messages: [...messages, { role: "assistant", content: response }],
      });
      console.log("response", response);
      const responseParse = Utils.fixJSON(response) as AIResponse;
      if (responseParse.view_delivery_cost) {
        if (state.get("deliveryCost")) {
          return flowDynamic(
            `El costo de envío es de ${state.get("deliveryCost")} ${
              state.get("currency") || "BOB"
            }`
          );
        }
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
        return flowDynamic(
          `El costo de envío es de ${res.baseCost} ${res.currency}`,
          {
            delay: 1000,
          }
        );
      }
      if (responseParse.view_menu) {
        // const messageTest = "Claro, fierilla! Aquí tienes el menú que está para darles esos antojitos. ¿Qué te gustaría pedir hoy? 🍔🥤"
        // responseParse.message = [responseParse.message.body, categories];
        // return flowDynamic(responseParse.message);
        return flowDynamic([responseParse.message.body, categories]);
      }
      if (responseParse.is_finish) {
        await flowDynamic("Realizando pedido... un momento por favor");
        messages = [...messages, { role: "system", content: promptFinish }];
        const responseFinish = await AIService.chat(newPrompt, messages);
        const responseParse = Utils.fixJSON(responseFinish) as AIResponseFinish;
        console.log("products", responseParse.products);
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
      return flowDynamic(sendMessage);
    } catch (error) {
      console.error("Error in faqFlow:", error);
      return endFlow("Por favor, intenta de nuevo");
    }
  }
);
