import { addKeyword, EVENTS } from "@builderbot/bot";
import PatioServiceApi from "../services/patio_service_api";
import { intentionFlow } from "./intention_flow";
import OrderUtils from "~/utils/parse_status";


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
    flowDynamic("Consultando el estado de tu pedido, por favor espera...");
    const order = await PatioServiceApi.getOrder(orderId);
    if (order) {
      return flowDynamic(
        `Tu pedido de ${order.store_name} #${order.id} está ${OrderUtils.parseStatus(
          order.status
        )}`,
        { delay: 1500 }
      );
    } else {
      return fallBack(
        "Lo sentimos, no encontramos tu pedido, vuelve a intentarlo con otro ID"
      );
    }
  }
);
