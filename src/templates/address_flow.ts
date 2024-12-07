import { addKeyword, EVENTS } from "@builderbot/bot";
import { i18n } from "~/translations";
import { intentionFlow } from "./intention_flow";
import patioServiceApi from "~/services/patio_service_api";
import { orderFlow } from "./order_flow";
import LocalStorage from "~/services/local_storage";
import { finishOrderFlow } from "./finish_order_flow";
import Constants from "~/utils/constants";
import { AddressUserModel } from "~/models/user.model";

// export const confirmAddressFlow = addKeyword(EVENTS.ACTION)
//   .addAnswer(
//     "Queremos confirmar tu dirección actual",
//     { delay: Constants.delayMessage },
//     async (ctx, { state, flowDynamic }) => {
//       const currentUser = await LocalStorage.getUser(state);
//       const address = currentUser.data.addresses[0];
//       await LocalStorage.saveAddressCurrent(state, address);
//       return flowDynamic([
//         `${address.name} - ${address.address}`,
//         "Quieres usar esta direccion? Si / No",
//       ]);
//     }
//   )
//   .addAction(
//     { capture: true, delay: Constants.delayMessage },
//     async (ctx, { state, gotoFlow, fallBack }) => {
//       if (ctx.body.toLowerCase() === "si" || ctx.body.toLowerCase() === "yes") {
//         const currentUser = await LocalStorage.getUser(state);
//         const address = currentUser.data.addresses[0];
//         await LocalStorage.saveAddressCurrent(state, address);
//         const products = await state.get("products");
//         if (products) {
//           await state.update({
//             verifyAddress: undefined,
//           });
//           return gotoFlow(finishOrderFlow);
//         }
//         ctx.body = Constants.menuMessage;
//         return gotoFlow(orderFlow);
//       } else if (ctx.body.toLowerCase() === "no") {
//         return gotoFlow(addressFlow);
//       } else {
//         return fallBack("Por favor, responde con si o no");
//       }
//     }
//   );

export const newAddressFlow = addKeyword(EVENTS.ACTION).addAnswer(
  "¿Podrías pasarme tu dirección escrita para ubicarte fácilmente? ej: Calle dechia #282",
  { capture: true, delay: Constants.delayMessage },
  async (ctx, { state, gotoFlow }) => {
    await state.update({ addressReferences: ctx.body });
    return gotoFlow(newAddressRegisterFlow);
  }
);

export const newAddressRegisterFlow = addKeyword(EVENTS.ACTION).addAnswer(
  "Con que nombre quieres guardar esta dirección? ej: Casa, Trabajo, etc",
  { capture: true, delay: Constants.delayMessage },
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    const currentUser = await LocalStorage.getUser(state);
    const currentAddressLocation = await LocalStorage.getAddressCurrent(state);
    const currentAddress: AddressUserModel = {
      name: ctx.body,
      address: state.get("addressReferences"), // TODO: get address from coordinates
      references: state.get("addressReferences"),
      latitude: currentAddressLocation.latitude,
      longitude: currentAddressLocation.longitude,
      coverageId: currentAddressLocation.coverageId,
      date: new Date(),
    };
    await LocalStorage.saveAddressCurrent(state, currentAddress);
    if (currentUser) {
      try {
        await patioServiceApi.saveAddress({
          ...currentAddress,
          cityId: state.get("location").cityId,
          userId: currentUser.data.id,
        });
        const userInfo = await patioServiceApi.getUser(ctx.from);
        await LocalStorage.saveUser(state, {
          data: userInfo,
          lastOrder: undefined,
          lastDate: new Date(),
        });
      } catch (error) {
        //
      }
    }
    await state.update({
      // coordinates: undefined,
      newAddress: undefined,
      addressReferences: undefined,
    });
    const products = await state.get("products");
    if (products) {
      await state.update({
        verifyAddress: undefined,
      });
      return gotoFlow(finishOrderFlow);
    }
    await flowDynamic("Gracias! Ahora puedes realizar tu pedido");
    ctx.body = Constants.menuMessage;
    return gotoFlow(orderFlow);
  }
);

export const addressFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, gotoFlow, endFlow }) => {
    // if (!state.get("coordinates")) {
      // await state.update({ newAddress: true });
      // const registerPosponed = await LocalStorage.getRegisterPosponed(state);
      // if (registerPosponed) {
      //   await flowDynamic(i18n.t("address.address_first_posponed"), { delay: Constants.delayMessage });
      // } else {
      //   await flowDynamic(i18n.t("address.address_first"), { delay: Constants.delayMessage });
      // }
      const newAddress = await state.get("newAddress");
      if (!newAddress) {
        await flowDynamic(i18n.t("address.address_first"), { delay: Constants.delayMessage });
      }
      return endFlow(i18n.t("address.address_share"));
    // } else {
    //   // if (state.get("onlyAddress")) {
    //   await LocalStorage.saveAddressCurrent(state, {
    //     name: "Ubicación actual",
    //     address: "-",
    //     references: "-",
    //     latitude: state.get("coordinates").latitude,
    //     longitude: state.get("coordinates").longitude,
    //     coverageId: state.get("location").id,
    //     date: new Date(),
    //   });
    //   state.update({
    //     onlyAddress: undefined,
    //     coordinates: undefined,
    //     verifyAddress: true,
    //   });
    //   // TODO: MOSTRAR DIRECTAMENTE EL MENU DE CATEGORIAS
    //   ctx.body = Constants.menuMessage;
    //   return gotoFlow(orderFlow);
    //   // } else {
    //   //   return gotoFlow(newAddressFlow);
    //   // }
    // }
  }
);

export const currentAddressFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, flowDynamic, gotoFlow, endFlow, fallBack }) => {
    const currentUser = await LocalStorage.getUser(state);
    const optionAddress = currentUser.data.addresses
    .map(
      (address: any, index: number) =>
        `${index + 1}. ${address.address} - ${address.name}`
    )
    .join("\n") + "\n0. Crear una nueva direccion";
    let msgAddress = "Tienes " + currentUser.data.addresses.length + " direcciones registradas, cual deseas utilizar?";
    if (currentUser.data.addresses.length == 1) {
      msgAddress = "Tienes 1 direccion registrada, deseas usarla? marca la opcion 1 o crea una nueva";
    }
    await flowDynamic(msgAddress + "\n" + optionAddress);
  }
).addAction(
  { capture: true, delay: Constants.delayMessage },
  async (ctx, { state, gotoFlow, fallBack, flowDynamic }) => {
    const currentUser = await LocalStorage.getUser(state);
    try {
      if (ctx.body == "0") {
        await state.update({
          newAddress: true,
        });
        return gotoFlow(addressFlow);
      }
      if (!isNaN(parseInt(ctx.body))) {
        const address = currentUser.data.addresses[parseInt(ctx.body) - 1];
        if (address) {
          await LocalStorage.saveAddressCurrent(state, address);
          const products = await state.get("products");
          if (products) {
            await state.update({
              verifyAddress: undefined,
            });
            return gotoFlow(finishOrderFlow);
          }
          await flowDynamic(`Muy bien, utilizaremos ${address.name}, ya puedes realizar tu pedido`, { delay: Constants.delayMessage });
          ctx.body = Constants.menuMessage;
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
