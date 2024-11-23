import { addKeyword, EVENTS } from "@builderbot/bot";
import { i18n } from "~/translations";
import { getUser, saveAddressCurrent } from "~/services/local_storage";
import { intentionFlow } from "./intention_flow";


export const addressFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    await flowDynamic([
      i18n.t("address.address_first"),
      i18n.t("address.address_share"),
    ]);
    // return gotoFlow(locationFlow);
  }
);

export const currentAddressFlow = addKeyword(EVENTS.ACTION).addAction(
  { capture: true },
  async (ctx, { state, flowDynamic, gotoFlow, fallBack }) => {
    const currentUser = await getUser(state);
    await flowDynamic("Tienes " + currentUser.data.addresses.length + " direcciones registradas, cual deseas utilizar?");
    await flowDynamic(currentUser.data.addresses.map((address: any, index: number) => `${index + 1}. ${address.address} - ${address.name}`).join("\n"));

    try {
      if (!isNaN(parseInt(ctx.body))) {
        const address = currentUser.data.addresses[parseInt(ctx.body) - 1];
        if (address) {
          await saveAddressCurrent(state, address);
          return gotoFlow(intentionFlow);
        } else {
          return fallBack("Numero de direccion no encontrado");
        }
      } else {
        return fallBack("Por favor, responde con el número de la dirección que deseas utilizar");
      }
    } catch (error) {
      return fallBack("Por favor, responde con el número de la dirección que deseas utilizar");
    }
  }
)