import { addKeyword, EVENTS } from "@builderbot/bot";
import patioServiceApi from "~/services/patio_service_api";
import { i18n } from "~/translations";
import { newAddressFlow } from "./address_flow";
import { orderFlow } from "./order_flow";
import MerchantUtils from "~/utils/merchant_near";
import LocalStorage from "~/services/local_storage";
import Constants from "~/utils/constants";

export const locationFlow = addKeyword(EVENTS.LOCATION).addAction(
  async (ctx, { state, flowDynamic, gotoFlow, endFlow, globalState }) => {
    const latitude = ctx.message.locationMessage.degreesLatitude;
    const longitude = ctx.message.locationMessage.degreesLongitude;
    const coverage = await patioServiceApi.getCoverage(latitude, longitude);
    if (coverage) {
      if (coverage.acceptOrder === 1) {
        await state.update({
          location: coverage,
        });
        // const merchantsGlobal = await LocalStorage.getMerchantsGlobal(
        //   globalState
        // );
        await LocalStorage.saveAddressCurrent(state, {
          name: "Ubicación actual",
          address: "-",
          references: "-",
          latitude: latitude,
          longitude: longitude,
          coverageId: coverage.id,
          date: new Date(),
        });
        const merchantsNear = await MerchantUtils.orderMerchantByDistanceUser(
          globalState,
          state
        );
        // if (merchantsGlobal.length > 0) {
        //   const merchantsNear = await MerchantUtils.merchantNear(
        //     merchantsGlobal,
        //     latitude,
        //     longitude
        //   );
        if (merchantsNear.length > 0) {
          await flowDynamic("Excelente, tenemos cobertura en tu zona", {
            delay: Constants.delayMessage,
          });
          await LocalStorage.saveMerchantsNearByUser(state, merchantsNear);
          state.update({
            verifyAddress: true,
          });
          // TODO: ARREGLAR QUE CUANDO REGISTRE LA UBICACION AL FINALIZAR EL PEDIDO, NO SE VAYA A LA PAGINA DE INICIO
          const newAddress = await state.get("newAddress");
          if (!newAddress) {
            const msgUser = await state.get("msgUser");
            ctx.body = msgUser || Constants.menuMessage;
            return gotoFlow(orderFlow);
          } else {
            return gotoFlow(newAddressFlow);
          }
          // if (state.get("newAddress")) {
          //   state.update({ coordinates: { latitude, longitude } });
          //   return gotoFlow(addressFlow);
          // }
          // await flowDynamic(i18n.t("location.location_coverage"), {
          //   delay: Constants.delayMessage,
          // });
          // ctx.body = Constants.menuMessage;
          // return gotoFlow(orderFlow);
          // } else {
          //   return endFlow(i18n.t("location.location_no_merchants"));
          // }
        } else {
          return endFlow(i18n.t("location.location_no_merchants"));
        }
      } else {
        return endFlow(i18n.t("location.location_no_coverage"));
      }
    }
    return endFlow(i18n.t("location.location_out_coverage"));
  }
);
