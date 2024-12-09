import { addKeyword } from "@builderbot/bot";
import patioServiceApi from "../services/patio_service_api";
import { config } from "~/config";

export const merchantFlow = addKeyword("merchants").addAction(
  async (ctx, { state, flowDynamic }) => {
    if (!state.get("location")) {
      return flowDynamic("Por favor, comparte tu ubicación para continuar");
    }
    const merchants = await patioServiceApi.merchantsByClient(config.clientMerchantId);
    if (merchants.length === 0) {
      return flowDynamic("No hay comercios disponibles en tu zona");
    }
  }
);
