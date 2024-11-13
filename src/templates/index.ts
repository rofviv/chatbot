import { createFlow } from "@builderbot/bot";
import { mainFlow } from "./main_flow";
import { optionsFlow } from "./options_flow";
import { orderFlow, getStatusOrderFlow, cancelOrderFlow, productsFlow } from "./order_flow";
import { intentionFlow } from "./intention_flow";

export default createFlow([
  mainFlow,
  optionsFlow,
  orderFlow,
  productsFlow,
  getStatusOrderFlow,
  cancelOrderFlow,
  intentionFlow,
]);
