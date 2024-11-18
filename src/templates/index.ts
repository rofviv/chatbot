import { createFlow } from "@builderbot/bot";
import { mainFlow } from "./main_flow";
import { optionsFlow } from "./options_flow";
import { orderFlow } from "./order_flow";
import { getStatusOrderFlow } from "./order_status_flow";
import { cancelOrderFlow } from "./order_cancel_flow";
import { intentionFlow } from "./intention_flow";
import { registerFlow, formRegisterFlow } from "./register_flow";
import { addressFlow } from "./address_flow";

export default createFlow([
  mainFlow,
  registerFlow,
  formRegisterFlow,
  optionsFlow,
  orderFlow,
  getStatusOrderFlow,
  cancelOrderFlow,
  intentionFlow,
  addressFlow,
]);
