import { addKeyword, EVENTS } from "@builderbot/bot";
import PatioServiceApi from "../services/patio_service_api";
import { intentionFlow } from "./intention_flow";

function parseStatus(status: string) {
  switch (status) {
    case "pending":
      return "pendiente 🕒";
    case "assigned":
      return "en camino al comercio 🏍️";
    case "arrived":
      return "esperando tu pedido 🍛";
    case "dispatched":
      return "en camino a tu ubicación 🏠";
    case "complete":
      return "completado ✅";
    case "canceled":
      return "cancelado ❌";
    default:
      return status;
  }
}

export const getStatusOrderFlow = addKeyword(EVENTS.ACTION).addAnswer(
  "Cual es el ID o numero de tu pedido?",
  {
    capture: true,
  },
  async (ctx, { state, flowDynamic, fallBack, gotoFlow }) => {
    if (ctx.body.toLowerCase() === "salir") {
      return gotoFlow(intentionFlow);
    }
    const orderId = Number(ctx.body);
    if (isNaN(orderId)) {
      return fallBack("El ID de pedido debe ser un número, intenta de nuevo");
    }
    const order = await PatioServiceApi.getOrder(orderId);
    if (order) {
      return flowDynamic(
        `Tu pedido de ${order.store_name} #${order.id} está ${parseStatus(order.status)}`
      );
    } else {
      return fallBack(
        "Lo sentimos, no encontramos tu pedido, vuelve a intentarlo con otro ID"
      );
    }
  }
);
