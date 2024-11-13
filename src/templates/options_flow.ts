import { addKeyword, EVENTS } from "@builderbot/bot";
// import {
//   orderFlow,
//   getStatusOrderFlow,
//   cancelOrderFlow,
//   productsFlow,
// } from "./order_flow";

const optionsFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(`Hola, bienvenido al bot de Patio Service`)
  // .addAnswer(
  //   [
  //     `En que puedo ayudarte?`,
  //     `1. Realizar un pedido`,
  //     `2. Ver el menu`,
  //     `3. Consultar el estado de mi pedido`,
  //     `4. Cancelar mi pedido`,
  //     `0. Salir`,
  //   ],
  //   {
  //     capture: true,
  //   },
    // async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
      // switch (ctx.body) {
      //   case "1":
      //     return gotoFlow(orderFlow);
      //   case "2":
      //     return gotoFlow(productsFlow);
      //   case "3":
      //     return gotoFlow(getStatusOrderFlow);
      //   case "4":
      //     return gotoFlow(cancelOrderFlow);
      //   case "0":
      //     return flowDynamic("Gracias por usar el bot");
      //   default:
      //     return fallBack("Tenes que elegir una opcion");
      // }
    // }
  // );

export { optionsFlow };
