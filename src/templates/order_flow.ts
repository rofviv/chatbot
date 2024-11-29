import { addKeyword, EVENTS } from "@builderbot/bot";
import AIService from "../services/ai_service";
import path from "path";
import fs from "fs";
import { intentionFlow } from "./intention_flow";
import { parseCategories, productsParseText } from "~/utils/parse_products";
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
      const products = productsParseText(JSON.parse(globalState.get("menuGlobal") as string));
      const categories = parseCategories(JSON.parse(globalState.get("menuGlobal") as string));
      const newPrompt = prompt + "\nEl menu disponible es: " + products;
      const response = await AIService.chat(newPrompt, messages);
      state.update({ messages: [...messages, { role: "assistant", content: response }] });
      const responseParse = JSON.parse(response);
      console.log("responseParse", responseParse.message);
      console.log("cart", responseParse.cart);
      console.log("is_finish", responseParse.is_finish as boolean);
      console.log("view_menu", responseParse.view_menu as boolean);
      // console.log("view_photo", responseParse.view_photo as boolean);
      // if (responseParse.view_photo === "true") {
      //   // const parseDataToFlow = data.map(item => ({body:`Item: ${item.name}`, media:item.photo}))
      //   const parseDataToFlow = [{body: "Económico Broasted"}]
      //   return flowDynamic(parseDataToFlow);
      // }
      if (responseParse.view_menu === "true") {
        responseParse.message = [responseParse.message.body, categories];
        return flowDynamic(responseParse.message);
      }
      if (responseParse.is_finish === true && responseParse.cart && responseParse.cart.length > 0) {
        console.log("Pedido finalizado !!!!!!!!!!!!!!!!!!");
        clearOrderCurrent(state);
        return flowDynamic(responseParse.message.body);
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

