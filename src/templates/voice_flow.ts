import { addKeyword, EVENTS } from "@builderbot/bot";
import { handlerAI } from "../services/whisper";
// import { mainFlow } from "./main_flow";
import { empanadaFlow } from "./empanada_flow";

const voiceFlow = addKeyword(EVENTS.VOICE_NOTE).addAction(
  async (ctx, ctxFn) => {
    const text = await handlerAI(ctx);
    ctx.body = text;
    // TODO: CHANGE TO EMPANADA MAMA FLOW
    await ctxFn.gotoFlow(empanadaFlow);
    // await ctxFn.gotoFlow(mainFlow);
  }
);

export { voiceFlow };
