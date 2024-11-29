import { addKeyword, EVENTS } from "@builderbot/bot";
import AIService from "../services/ai_service";
import path from "path";
import fs from "fs";
import { intentionFlow } from "./intention_flow";
import { parseCategories, productsParseText } from "~/utils/parse_products";
import { i18n } from "~/translations";
import { saveOrderCurrent, clearOrderCurrent, getAddressCurrent, getMerchantsGlobal, saveMerchantsNearByUser } from "~/services/local_storage";
import patioServiceApi from "~/services/patio_service_api";
import { getMerchantsNearByUser } from "~/services/local_storage";
import { cityId_SC, vehicleTypeId_MOTORCYCLE } from "~/utils/constants";
import { merchantNear } from "~/utils/merchant_near";

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
      const products = productsParseText(JSON.parse(globalState.get("menuGlobal") as string));
      const categories = parseCategories(JSON.parse(globalState.get("menuGlobal") as string));
      let newPrompt = prompt + "\nEl menu disponible es: " + products;
      if (state.get("deliveryCost")) {
        newPrompt += "\nEl costo de envío es de " + state.get("deliveryCost") + " " + (state.get("currency") || "BOB");
      }
      const response = await AIService.chat(newPrompt, messages);
      state.update({ messages: [...messages, { role: "assistant", content: response }] });
      console.log("response", response);
      const responseParse = JSON.parse(response);
      console.log("is_finish", responseParse.is_finish as boolean);
      console.log("view_menu", responseParse.view_menu as boolean);
      console.log("view_delivery_cost", responseParse.view_delivery_cost as boolean);
      if (responseParse.view_delivery_cost === "true") {
        if (state.get("deliveryCost")) {
          return flowDynamic(`El costo de envío es de ${state.get("deliveryCost")} ${state.get("currency") || "BOB"}`);
        }
        let merchants = await getMerchantsNearByUser(state);
        const userAddress = await getAddressCurrent(state);
        if (!merchants) {
          const merchantsGlobal = await getMerchantsGlobal(globalState);
          const merchantsNear = await merchantNear(merchantsGlobal, userAddress.latitude, userAddress.longitude);
          await saveMerchantsNearByUser(state, merchantsNear);
          merchants = await getMerchantsNearByUser(state);
        }
        const res = await patioServiceApi.getQuote({
          merchantId: merchants[0].id,
          fromLatitude: merchants[0].latitude,
          fromLongitude: merchants[0].longitude,
          toLatitude: userAddress.latitude,
          toLongitude: userAddress.longitude,
          returnRoute: 0,
          vehicleTypeId: vehicleTypeId_MOTORCYCLE,
          cityId: cityId_SC,
        });
        return flowDynamic(`El costo de envío es de ${res.baseCost} ${res.currency}`, {
          delay: 1000,
        });
      }
      if (responseParse.view_menu === "true") {
        // const messageTest = "Claro, fierilla! Aquí tienes el menú que está para darles esos antojitos. ¿Qué te gustaría pedir hoy? 🍔🥤"
        responseParse.message = [responseParse.message.body, categories];
        return flowDynamic(responseParse.message);
      }
      if (responseParse.is_finish === true) {
        console.log("Pedido finalizado !!!!!!!!!!!!!!!!!!");
        clearOrderCurrent(state);
        state.update({
          messages: [],
          deliveryCost: undefined,
        });
        return endFlow(responseParse.message.body);
      }
      if (responseParse.message.media) {
        responseParse.message = [{body: responseParse.message.body, media: responseParse.message.media}];
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

