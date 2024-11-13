import { addKeyword, EVENTS } from "@builderbot/bot";

export const productsFlow = addKeyword("2").addAction(
  async (ctx, { state, endFlow, gotoFlow }) => {
    return endFlow("Ver el menu");
  }
);

