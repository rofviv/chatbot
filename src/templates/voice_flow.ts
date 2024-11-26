import { addKeyword, EVENTS } from "@builderbot/bot";
import { handlerAI } from "../services/whisper";
import { mainFlow } from "./main_flow";

const voiceFlow = addKeyword(EVENTS.VOICE_NOTE).addAction(
  async (ctx, ctxFn) => {
    const text = await handlerAI(ctx);
    ctx.body = text;
    await ctxFn.gotoFlow(mainFlow);
  }
);

export { voiceFlow };
