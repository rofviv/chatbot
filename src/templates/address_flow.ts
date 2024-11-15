import { addKeyword, EVENTS } from "@builderbot/bot";

export const addressFlow = addKeyword(EVENTS.LOCATION).addAnswer(
  "Revisando tu ubicación, por favor espera un momento...",
  null,
  async (ctx, { state, endFlow, gotoFlow }) => {
    const userLatitude = ctx.message.locationMessage.degreesLatitude;
    const userLongitude = ctx.message.locationMessage.degreesLongitude;
    return endFlow(
      `Tu ubicación actual es: Latitud: ${userLatitude}, Longitud: ${userLongitude}`
    );
  }
);
