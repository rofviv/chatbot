import { addKeyword, EVENTS } from "@builderbot/bot";
import PatioServiceApi from "../services/patio_service_api";
import { intentionFlow } from "./intention_flow";
import { parseStatus } from "../utils/parse_status";
export const cancelOrderFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    "Cual es el ID o numero de tu pedido para cancelarlo?",
    {
      capture: true,
    },
    async (ctx, { state, endFlow, flowDynamic, fallBack, gotoFlow }) => {
      if (ctx.body.toLowerCase() === "salir") {
        return gotoFlow(intentionFlow);
      }
      const orderId = Number(ctx.body);
      if (isNaN(orderId)) {
        return fallBack("El ID de pedido debe ser un número, intenta de nuevo");
      }
      await flowDynamic("Verificando tu pedido, por favor espera...");
      const order = await PatioServiceApi.getOrder(orderId);
      if (order) {
        if (order.status === "canceled") {
          return endFlow("Tu pedido ya fue cancelado");
        }
        if (order.status === "completed") {
          return endFlow("Tu pedido ya fue completado, no se puede cancelar");
        }
        await flowDynamic(
          `Tu pedido tiene el estado: ${parseStatus(
            order.status
          )}, deseas cancelarlo? Si/No`
        );
        await state.update({ orderId });
      } else {
        return fallBack(
          "Lo sentimos, no encontramos tu pedido, vuelve a intentarlo con otro ID"
        );
      }
    }
  )
  .addAction(
    {
      capture: true,
    },
    async (ctx, { state, endFlow, flowDynamic }) => {
      if (ctx.body.toLowerCase() === "si") {
        const orderId = state.get("orderId");
        const success = await PatioServiceApi.cancelOrder(orderId);
        await flowDynamic("Cancelando tu pedido, por favor espera...");
        if (success) {
          return endFlow("Pedido cancelado, lamentamos el inconveniente");
        } else {
          return endFlow(
            "No se pudo cancelar el pedido, por favor comunícate con soporte"
          );
        }
      }
      if (ctx.body.toLowerCase() === "no") {
        return endFlow("Pedido no cancelado");
      }
    }
  );
