import { addKeyword, EVENTS } from "@builderbot/bot";
import patioServiceApi from "~/services/patio_service_api";
import { i18n } from "~/translations";
import { addressFlow } from "./address_flow";
import { orderFlow } from "./order_flow";
import Utils from "~/utils/merchant_near";
import LocalStorage from "~/services/local_storage";

export const locationFlow = addKeyword(EVENTS.LOCATION).addAction(
  async (ctx, { state, flowDynamic, gotoFlow, endFlow, globalState }) => {
    const latitude = ctx.message.locationMessage.degreesLatitude;
    const longitude = ctx.message.locationMessage.degreesLongitude;
    const coverage = await patioServiceApi.getCoverage(latitude, longitude);
    console.log("coverage", coverage);
    if (coverage) {
      if (coverage.acceptOrder === 1) {
        await state.update({
          location: coverage,
        });
        const merchantsGlobal = await LocalStorage.getMerchantsGlobal(globalState);
        if (merchantsGlobal.length > 0) {
          const merchantsNear = await Utils.merchantNear(merchantsGlobal, latitude, longitude);
          await LocalStorage.saveMerchantsNearByUser(state, merchantsNear);
          console.log("state", state.get("newAddress"));
          if (state.get("newAddress")) {
            state.update({ coordinates: { latitude, longitude } });
            return gotoFlow(addressFlow);
          }
          await flowDynamic(i18n.t("location.location_coverage"), { delay: 1000 });
          ctx.body = "Muestrame el menu";
          return gotoFlow(orderFlow);
        } else {
          return endFlow(
            i18n.t("location.location_no_merchants")
          );
        }
      } else {
        return endFlow(
          i18n.t("location.location_no_coverage")
        );
      }
    }
    return endFlow(
      i18n.t("location.location_out_coverage")
    );
  }
);
