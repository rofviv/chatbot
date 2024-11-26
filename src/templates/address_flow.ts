import { addKeyword, EVENTS } from "@builderbot/bot";
import { i18n } from "~/translations";
import { getUser, saveAddressCurrent } from "~/services/local_storage";
import { intentionFlow } from "./intention_flow";
import patioServiceApi from "~/services/patio_service_api";

export const confirmAddressFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    "Queremos confirmar tu dirección actual",
    { delay: 1200 },
    async (ctx, { state, flowDynamic, gotoFlow }) => {
      const currentUser = await getUser(state);
      const address = currentUser.data.addresses[0];
      return flowDynamic([
        `${address.name} - ${address.address}`,
        "Quieres usar esta direccion? Si / No",
      ]);
    }
  )
  .addAction(
    { capture: true, delay: 1200 },
    async (ctx, { state, gotoFlow, fallBack, flowDynamic }) => {
      if (ctx.body.toLowerCase() === "si" || ctx.body.toLowerCase() === "yes") {
        ctx.body = "Quiero ver el menu";
        return gotoFlow(intentionFlow);
      } else if (ctx.body.toLowerCase() === "no") {
        return gotoFlow(addressFlow);
      } else {
        return fallBack("Por favor, responde con si o no");
      }
    }
  );

export const newAddressFlow = addKeyword(EVENTS.ACTION).addAnswer(
  "Con que nombre deseas guardar esta direccion? ej: Casa, Trabajo, etc",
  { capture: true, delay: 1200 },
  async (ctx, { state, gotoFlow }) => {
    await state.update({ nameAddress: ctx.body });
    return gotoFlow(newAddressReferencesFlow);
  }
);

export const newAddressReferencesFlow = addKeyword(EVENTS.ACTION).addAnswer(
  "Puedes darnos alguna referencia para que podamos encontrarte? ej: Puerta, Edificio, Nro Casa, etc",
  { capture: true, delay: 1200 },
  async (ctx, { state, flowDynamic, gotoFlow, endFlow }) => {
    const currentUser = await getUser(state);
    const address = await patioServiceApi.saveAddress({
      name: state.get("nameAddress"),
      address: ctx.body, // TODO: get address from coordinates
      references: ctx.body,
      latitude: state.get("coordinates").latitude,
      longitude: state.get("coordinates").longitude,
      userId: currentUser.data.id,
      cityId: state.get("location").cityId,
      coverageId: state.get("location").id,
    });

    if (address) {
      await state.update({
        coordinates: undefined,
        newAddress: false,
        nameAddress: undefined,
      });
      await flowDynamic("Gracias! Ahora puedes realizar tu pedido");
      ctx.body = "Quiero ver el menu";
      return gotoFlow(intentionFlow);
    } else {
      return endFlow("ocurrió un error, intenta de nuevo");
    }
  }
);

export const addressFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, gotoFlow, endFlow }) => {
    console.log("coordinates", state.get("coordinates"));
    if (!state.get("coordinates")) {
      await state.update({ newAddress: true });
      await flowDynamic(i18n.t("address.address_first"));
      return endFlow(i18n.t("address.address_share"));
    } else {
      return gotoFlow(newAddressFlow);
    }
    // return gotoFlow(locationFlow);
  }
);

export const currentAddressFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, gotoFlow, endFlow, fallBack }) => {
    const currentUser = await getUser(state);
    await flowDynamic(
      "Tienes " +
        currentUser.data.addresses.length +
        " direcciones registradas, cual deseas utilizar?\n" +
        currentUser.data.addresses
          .map(
            (address: any, index: number) =>
              `${index + 1}. ${address.address} - ${address.name}`
          )
          .join("\n") + "\n0. Crear una nueva direccion"
    );
  }
).addAction(
  { capture: true, delay: 1200 },
  async (ctx, { state, gotoFlow, fallBack, flowDynamic }) => {
    const currentUser = await getUser(state);
    try {
      if (ctx.body == "0") {
        return gotoFlow(newAddressFlow);
      }
      if (!isNaN(parseInt(ctx.body))) {
        const address = currentUser.data.addresses[parseInt(ctx.body) - 1];
        if (address) {
          await saveAddressCurrent(state, address);
          await flowDynamic(`Muy bien, utilizaremos ${address.name}, ya puedes realizar tu pedido`);
          ctx.body = "Quiero ver el menu";
          return gotoFlow(intentionFlow);
        } else {
          return fallBack("Numero de direccion no encontrado");
        }
      } else {
        return fallBack(
          "Por favor, responde con el número de la dirección que deseas utilizar"
        );
      }
    } catch (error) {
      return fallBack(
        "Por favor, responde con el número de la dirección que deseas utilizar"
      );
    }
  }
);
