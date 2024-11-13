import { addKeyword, EVENTS } from "@builderbot/bot";
import PatioServiceApi from "../services/patio_service_api";
// export const getStatusOrderFlow = addKeyword("3").addAction(
//   async (ctx, { state, endFlow, gotoFlow }) => {
//     return endFlow("Status de tu pedido");
//   }
// );

export const getStatusOrderFlow = addKeyword("3").addAnswer(
  "Cual es el ID o numero de tu pedido?",
  {
    capture: true,
  },
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    // TODO: Search order in database
    const order = await PatioServiceApi.getOrder(ctx.body);
    if (order) {
      return flowDynamic(
        `El estado de tu pedido #${order.id} es: ${order.status}`
      );
    } else {
      return flowDynamic("ID de pedido invalido, intenta de nuevo");
    }
  }
);
