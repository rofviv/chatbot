import { addKeyword, EVENTS } from "@builderbot/bot";
import { intentionFlow } from "./intention_flow";
import patioServiceApi from "../services/patio_service_api";

const mainFlow = addKeyword(EVENTS.WELCOME)
  // .addAnswer(`🙌 Hello welcome to this *Chatbot*`)
  .addAction(async (ctx, ctxFn) => {
    const phone = ctx.from;
    console.log("Phone", phone);
    const userInfo = await patioServiceApi.getUserInfo(phone);
    if (!userInfo) {
      await ctxFn.flowDynamic("Hola! Bienvenido, eres nuevo por aqui, quieres registrarte?");
      // return ctxFn.gotoFlow(registerFlow);
    } else {
      await ctxFn.flowDynamic(`Hola! ${userInfo.name}, bienvenido de vuelta. ¿Que deseas hacer hoy?`);
      // return ctxFn.gotoFlow(intentionFlow);
    }
    return ctxFn.gotoFlow(intentionFlow);
  });

export { mainFlow };
