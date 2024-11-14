import { addKeyword, EVENTS } from "@builderbot/bot";

export const productsFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, endFlow, gotoFlow }) => {
    return endFlow("Ver el menu");
  }
);

