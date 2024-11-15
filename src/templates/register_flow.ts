import { EVENTS } from "@builderbot/bot";

import { addKeyword } from "@builderbot/bot";
import { intentionFlow } from "./intention_flow";
import patioServiceApi from "../services/patio_service_api";
const registerFlow = addKeyword(EVENTS.ACTION).addAnswer(
  "Hola! Bienvenido, eres nuevo por aqui, quieres registrarte? Solo te tomará 1 minuto. Si/No",
  {
    capture: true,
  },
  async (ctx, { state, endFlow, gotoFlow, fallBack }) => {
    if (ctx.body.toLowerCase() === "si") {
      return gotoFlow(formRegisterFlow);
    } else if (ctx.body.toLowerCase() === "no") {
      await state.update({ registerPosponed: true });
      endFlow("No hay problema, lo haremos despues");
      return gotoFlow(intentionFlow);
    } else {
      return fallBack("Por favor, responde con Si o No");
    }
  }
);

const formRegisterFlow = addKeyword(EVENTS.ACTION)
  .addAnswer("Perfecto, voy a proceder a hacerte algunas preguntas")
  .addAnswer(
    "Primero, cual es tu nombre?",
    { capture: true, delay: 1500 },
    async (ctx, { state, flowDynamic }) => {
      await state.update({ name: ctx.body });
      return flowDynamic("Perfecto " + ctx.body);
    }
  )
  .addAnswer(
    "Ahora, cual es tu email?",
    { capture: true, delay: 2000 },
    async (ctx, { state, fallBack, flowDynamic }) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ctx.body)) {
        return fallBack("El email no es valido, por favor intenta de nuevo");
      }
      const exists = await patioServiceApi.verifyExistsEmail(ctx.body);
      if (exists) {
        return fallBack(
          "El email ya está registrado, por favor intenta con otro"
        );
      }
      await state.update({ email: ctx.body });
    }
  )
  .addAnswer(
    "Guardando datos, por favor espere...",
    { delay: 1500 },
    async (ctx, { state, endFlow, gotoFlow }) => {
      const phone = ctx.from;
      const name = state.get("name");
      const email = state.get("email");
      const user = await patioServiceApi.createUser(phone, name, email);
      if (user) {
        endFlow("Gracias por registrarte");
        return gotoFlow(intentionFlow);
      } else {
        return endFlow(
          "Hubo un error al registrar, por favor intenta más tarde o comunícate con soporte"
        );
      }
    }
  );

export { registerFlow, formRegisterFlow };
