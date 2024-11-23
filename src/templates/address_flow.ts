import { addKeyword, EVENTS } from "@builderbot/bot";

export const addressFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic }) => {
    await flowDynamic([
      "Para mejorar la experiencia, necesitamos conocer tu ubicación",
      "Por favor enviame tu ubicación GPS (ubicación normal no en tiempo real)",
    ]);
    // return gotoFlow(locationFlow);
  }
);
