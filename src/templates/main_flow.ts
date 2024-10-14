import { addKeyword, EVENTS } from "@builderbot/bot";
import { faqFlow } from "./faq_flow";
import patioServiceApi from "../services/patio_service_api";
import { registerFlow } from "./register_flow";

const mainFlow = addKeyword(EVENTS.WELCOME)
  // .addAnswer(`🙌 Hello welcome to this *Chatbot*`)
  .addAction(async (ctx, ctxFn) => {
    const isUserRegistered = await patioServiceApi.getUser(ctx.from);
    if (!isUserRegistered) {
      return ctxFn.gotoFlow(registerFlow);
    } else {
      return ctxFn.gotoFlow(faqFlow);
    }
  });

export { mainFlow };
