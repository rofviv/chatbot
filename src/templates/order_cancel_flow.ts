import { addKeyword, EVENTS } from "@builderbot/bot";

export const cancelOrderFlow = addKeyword("4").addAction(
  async (ctx, { state, endFlow, gotoFlow }) => {
    return endFlow("Cancelar tu pedido");
  }
);
