import { createFlow } from "@builderbot/bot";
import { mainFlow } from "./main_flow";
import { orderFlow } from "./order_flow";
import { getStatusOrderFlow } from "./order_status_flow";
import { cancelOrderFlow } from "./order_cancel_flow";
import { intentionFlow } from "./intention_flow";
import { registerFlow, formRegisterFlow } from "./register_flow";
import { locationFlow } from "./location_flow";
import { voiceFlow } from "./voice_flow";
import { merchantFlow } from "./merchant_flow";
import { addressFlow, confirmAddressFlow, currentAddressFlow, newAddressFlow, newAddressReferencesFlow } from "./address_flow";
import { empanadaFlow } from "./empanada_flow";
export default createFlow([
  mainFlow,
  registerFlow,
  formRegisterFlow,
  orderFlow,
  getStatusOrderFlow,
  cancelOrderFlow,
  intentionFlow,
  locationFlow,
  voiceFlow,
  merchantFlow,
  addressFlow,
  empanadaFlow,
  newAddressFlow,
  currentAddressFlow,
  newAddressReferencesFlow,
  confirmAddressFlow,
]);
