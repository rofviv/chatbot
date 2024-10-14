import { addKeyword, EVENTS } from "@builderbot/bot";
import patioServiceApi from "../services/patio_service_api";

const registerFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    `Quieres registrarte?`,
    {
      capture: true,
      buttons: [{ body: "Si, quiero" }, { body: "No, gracias" }],
    },
    async (ctx, ctxFn) => {
      if (ctx.body === "No, gracias") {
        return ctxFn.endFlow(
          "El registro fue cancelado, puedes volver a escribirle al bot para registrarte"
        );
      } else if (ctx.body === "Si, quiero") {
        return ctxFn.flowDynamic(
          "Perfecto, voy a proceder a hacerte algunas preguntas"
        );
      } else {
        return ctxFn.fallBack("Tenes que elegir una opcion");
      }
    }
  )
  .addAnswer(
    `Primero, cual es tu nombre?`,
    { capture: true },
    async (ctx, ctxFn) => {
      await ctxFn.flowDynamic("Perfecto " + ctx.body);
      await ctxFn.state.update({ name: ctx.body });
    }
  )
  .addAnswer(
    `Ahora, cual es tu email?`,
    { capture: true },
    async (ctx, ctxFn) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ctx.body)) {
        return ctxFn.fallBack("El email no es valido");
      }
      const state = ctxFn.state.getMyState();
      await patioServiceApi.createUser(ctx.from, state.name, ctx.body);
      await ctxFn.flowDynamic("Gracias por registrarte " + state.name);
    }
  );

export { registerFlow };
