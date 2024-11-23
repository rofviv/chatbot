import { addKeyword, EVENTS } from "@builderbot/bot";
import patioServiceApi from "~/services/patio_service_api";
import { clientMerchantId } from "~/utils/constants";
import { merchantNear } from "~/utils/merchant_near";
export const locationFlow = addKeyword(EVENTS.LOCATION).addAction(
  async (ctx, { state, flowDynamic, endFlow }) => {
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
          return flowDynamic(
            merchantsNear.map((merchant) => `${merchant.name} - ${merchant.distance_from_client.toFixed(2)} km`).join("\n")
          );
        } else {
          return endFlow(
            "No tenemos comercios disponibles en este momento, intenta más tarde"
          );
        }
      } else {
        return endFlow(
          "Lamentamos que por el momento no estamos disponibles en tu zona, intenta más tarde"
        );
      }
    }
    return endFlow(
      "Lamentamos informarte que no tenemos cobertura en tu ubicación"
    );
  }
);
