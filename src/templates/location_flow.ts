import { addKeyword, EVENTS } from "@builderbot/bot";
import patioServiceApi from "~/services/patio_service_api";
import { i18n } from "~/translations";
import { clientMerchantId } from "~/utils/constants";
import { merchantNear } from "~/utils/merchant_near";
import { saveMerchantsNearByUser } from "~/services/local_storage";
import { intentionFlow } from "./intention_flow";

export const locationFlow = addKeyword(EVENTS.LOCATION).addAction(
  async (ctx, { state, flowDynamic, gotoFlow, endFlow }) => {
    const latitude = ctx.message.locationMessage.degreesLatitude;
    const longitude = ctx.message.locationMessage.degreesLongitude;
    const coverage = await patioServiceApi.getCoverage(latitude, longitude);
    if (coverage) {
      if (coverage.acceptOrder === 1) {
        await state.update({
          location: coverage,
        });
        const merchants = await patioServiceApi.merchantsByClient(clientMerchantId);
        if (merchants.length > 0) {
          const merchantsNear = await merchantNear(merchants, latitude, longitude);
          await saveMerchantsNearByUser(state, merchantsNear);
          // return flowDynamic(
          //   merchantsNear.map((merchant) => `${merchant.name} - ${merchant.distance_from_client.toFixed(2)} km`).join("\n")
          // );
          await flowDynamic(i18n.t("location.location_coverage"), { delay: 1000 });
          ctx.body = "Quiero ver el menu";
          return gotoFlow(intentionFlow);
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
