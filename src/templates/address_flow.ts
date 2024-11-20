import { addKeyword, EVENTS } from "@builderbot/bot";

export const addressFlow = addKeyword(EVENTS.LOCATION).addAction(
  async (ctx, { state, flowDynamic }) => {
    const latitude = ctx.message.locationMessage.degreesLatitude;
    const longitude = ctx.message.locationMessage.degreesLongitude;
    const name = ctx.message.locationMessage.name;
    const address = ctx.message.locationMessage.address;
    await state.update({
      location: {
        latitude,
        longitude,
        name,
        address,
      },
    });
    return flowDynamic(`Ubicación guardada: ${name} - ${address}`);
  }
);
