import { addKeyword } from "@builderbot/bot";
import patioServiceApi from "../services/patio_service_api";
import { merchantNear } from "../utils/merchant_near";
import { clientMerchantId } from "../utils/constants";
import { LocationGPS } from "./main_flow";

export const merchantFlow = addKeyword("merchants").addAction(
  async (ctx, { state, flowDynamic }) => {
    if (!state.get("location")) {
      return flowDynamic("Por favor, comparte tu ubicación para continuar");
    }
    const merchants = await patioServiceApi.merchantsByClient(clientMerchantId);
    if (merchants.length === 0) {
      return flowDynamic("No hay comercios disponibles en tu zona");
    }
    const location = state.get("location") as LocationGPS;
    const merchantsNear = await merchantNear(merchants, location.latitude, location.longitude);
    return flowDynamic(
      merchantsNear.map((merchant) => `${merchant.name} - ${merchant.distance_from_client.toFixed(2)} km`).join("\n")
    );
  }
);
