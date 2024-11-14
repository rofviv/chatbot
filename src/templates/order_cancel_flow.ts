import { addKeyword, EVENTS } from "@builderbot/bot";

export const cancelOrderFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, endFlow, gotoFlow }) => {
    return endFlow("Cancelar tu pedido");
  }
);
