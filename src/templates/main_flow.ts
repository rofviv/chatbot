import { addKeyword, EVENTS } from "@builderbot/bot";
import { intentionFlow } from "./intention_flow";

const mainFlow = addKeyword(EVENTS.WELCOME)
  // .addAnswer(`🙌 Hello welcome to this *Chatbot*`)
  .addAction(async (ctx, ctxFn) => {
    // const isUserRegistered = await patioServiceApi.getUser(ctx.from);
    // if (!isUserRegistered) {
    //   return ctxFn.gotoFlow(registerFlow);
    // } else {
    return ctxFn.gotoFlow(intentionFlow);
    // }
  });


export { mainFlow };
