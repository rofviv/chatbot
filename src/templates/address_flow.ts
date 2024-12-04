import { addKeyword, EVENTS } from "@builderbot/bot";
import { i18n } from "~/translations";
import { intentionFlow } from "./intention_flow";
import patioServiceApi from "~/services/patio_service_api";
import { orderFlow } from "./order_flow";
import LocalStorage from "~/services/local_storage";

export const confirmAddressFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    "Queremos confirmar tu dirección actual",
    { delay: 1200 },
    async (ctx, { state, flowDynamic, gotoFlow }) => {
      const currentUser = await LocalStorage.getUser(state);
      const address = currentUser.data.addresses[0];
      await LocalStorage.saveAddressCurrent(state, address);
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
        ctx.body = "Muestrame el menu";
        const currentUser = await LocalStorage.getUser(state);
        const address = currentUser.data.addresses[0];
        await LocalStorage.saveAddressCurrent(state, address);
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
    const currentUser = await LocalStorage.getUser(state);
    if (currentUser) {
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
        await LocalStorage.saveAddressCurrent(state, address);
        await state.update({
          coordinates: undefined,
          newAddress: false,
          nameAddress: undefined,
        });
        await flowDynamic("Gracias! Ahora puedes realizar tu pedido");
        // ctx.body = "Muestrame el menu";
        // return gotoFlow(intentionFlow);
        ctx.body = "Muestrame el menu";
        return gotoFlow(orderFlow);
      } else {
        return endFlow("ocurrió un error, intenta de nuevo");
      }
    } else {
      await LocalStorage.saveAddressCurrent(state, {
        id: 0,
        name: state.get("nameAddress"),
        address: ctx.body, // TODO: get address from coordinates
        references: ctx.body,
        latitude: state.get("coordinates").latitude,
        longitude: state.get("coordinates").longitude,
        coverageId: state.get("location").id,
      });
      await flowDynamic("Gracias! Ahora puedes realizar tu pedido");
      // ctx.body = "Muestrame el menu";
      // return gotoFlow(intentionFlow);
      ctx.body = "Muestrame el menu";
      return gotoFlow(orderFlow);
    }
  }
);

export const addressFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, gotoFlow, endFlow }) => {
    if (!state.get("coordinates")) {
      await state.update({ newAddress: true });
      const registerPosponed = await LocalStorage.getRegisterPosponed(state);
      if (registerPosponed) {
        await flowDynamic(i18n.t("address.address_first_posponed"));
      } else {
        await flowDynamic(i18n.t("address.address_first"));
      }
      return endFlow(i18n.t("address.address_share"));
    } else {
      if (state.get("onlyAddress")) {
        state.update({
          onlyAddress: undefined,
        });
        await LocalStorage.saveAddressCurrent(state, {
          id: 0,
          name: "Ubicación actual",
          address: "Ubicación actual",
          references: "Ubicación actual",
          latitude: state.get("coordinates").latitude,
          longitude: state.get("coordinates").longitude,
          coverageId: state.get("location").id,
        });
        await flowDynamic("Gracias! Ahora puedes realizar tu pedido");
        // ctx.body = "Muestrame el menu";
        // return gotoFlow(intentionFlow);
        ctx.body = "Muestrame el menu";
        return gotoFlow(orderFlow);
      } else {
        return gotoFlow(newAddressFlow);
      }
    }
  }
);

export const currentAddressFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, gotoFlow, endFlow, fallBack }) => {
    const currentUser = await LocalStorage.getUser(state);
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
    const currentUser = await LocalStorage.getUser(state);
    try {
      if (ctx.body == "0") {
        return gotoFlow(newAddressFlow);
      }
      if (!isNaN(parseInt(ctx.body))) {
        const address = currentUser.data.addresses[parseInt(ctx.body) - 1];
        if (address) {
          await LocalStorage.saveAddressCurrent(state, address);
          await flowDynamic(`Muy bien, utilizaremos ${address.name}, ya puedes realizar tu pedido`);
          // ctx.body = "Muestrame el menu";
          // return gotoFlow(intentionFlow);
          ctx.body = "Muestrame el menu";
          return gotoFlow(orderFlow);
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
