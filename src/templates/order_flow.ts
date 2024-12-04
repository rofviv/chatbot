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

const pathPrompt = path.join(
  process.cwd(),
  "assets/prompts",
  "prompt_ai_order.txt"
);
const prompt = fs.readFileSync(pathPrompt, "utf8");

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
      const response = await AIService.chat(newPrompt, messages);
      state.update({
        messages: [...messages, { role: "assistant", content: response }],
      });
      console.log("response", response);
      const responseParse = JSON.parse(response);
      if (responseParse.view_delivery_cost === "true") {
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
      if (responseParse.view_menu === "true") {
        // const messageTest = "Claro, fierilla! Aquí tienes el menú que está para darles esos antojitos. ¿Qué te gustaría pedir hoy? 🍔🥤"
        responseParse.message = [responseParse.message.body, categories];
        return flowDynamic(responseParse.message);
      }
      if (responseParse.is_finish === "true") {
        await flowDynamic("Realizando pedido... Espera un momento por favor");
        messages = [...messages, { role: "system", content: promptFinish }];
        const responseFinish = await AIService.chat(newPrompt, messages);
        const responseParse = JSON.parse(responseFinish);
        console.log("products", responseParse.products);
        LocalStorage.clearOrderCurrent(state);
        state.update({
          messages: [],
          deliveryCost: undefined,
          products: responseParse.products,
        });
        return gotoFlow(finishOrderFlow);
      }
      if (responseParse.message.media) {
        responseParse.message = [
          {
            body: responseParse.message.body,
            media: responseParse.message.media,
          },
        ];
      } else {
        responseParse.message = responseParse.message.body;
      }
      return flowDynamic(responseParse.message);
    } catch (error) {
      console.error("Error in faqFlow:", error);
      return endFlow("Por favor, intenta de nuevo");
    }
  }
);
