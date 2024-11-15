import { addKeyword, EVENTS } from "@builderbot/bot";
import patioServiceApi from "../services/patio_service_api";

const registerOldFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    `Bienvenido a Patio Service, para registrarte necesito que me des algunos datos`
  )
  .addAnswer(
    `Primero, cual es tu nombre?`,
    { capture: true },
    async (ctx, ctxFn) => {
      await ctxFn.flowDynamic("Perfecto " + ctx.body);
      await ctxFn.state.update({ name: ctx.body });
    }
  );
//   .addAnswer(
//     [`Quieres registrarte?`, `1. Si, quiero`, `2. No, gracias`],
//     {
//       capture: true,
//       // buttons: [{ body: "Si, quiero" }, { body: "No, gracias" }],
//     }
//     // async (ctx, ctxFn) => {
//     //   if (ctx.body == "2" || ctx.body.toLowerCase().includes("no")) {
//     //     return ctxFn.flowDynamic(
//     //       "El registro fue cancelado, puedes volver a escribirle al bot para registrarte"
//     //     );
//     //   } else if (ctx.body == "1" || ctx.body.toLowerCase().includes("si")) {
//     //     return ctxFn.flowDynamic(
//     //       "Perfecto, voy a proceder a hacerte algunas preguntas"
//     //     );
//     //   } else {
//     //     return ctxFn.fallBack("Tenes que elegir una opcion");
//     //   }
//     // }
//   )
//   .addAnswer("Thanks", async (ctx, ctxFn) => {
//     const userAnswer = ctx.body;
//     if (userAnswer === "1") {
//       return ctxFn.flowDynamic("Gracias por registrarte");
//     }
//     await ctxFn.endFlow("Gracias por registrarte");
//   });
// // .addAnswer(
// //   `Primero, cual es tu nombre?`,
// //   { capture: true },
// //   async (ctx, ctxFn) => {
// //     await ctxFn.flowDynamic("Perfecto " + ctx.body);
// //     await ctxFn.state.update({ name: ctx.body });
// //   }
// // )
// // .addAnswer(
// //   `Ahora, cual es tu email?`,
// //   { capture: true },
// //   async (ctx, ctxFn) => {
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(ctx.body)) {
// //       return ctxFn.fallBack("El email no es valido");
// //     }
// //     const state = ctxFn.state.getMyState();
// //     await patioServiceApi.createUser(ctx.from, state.name, ctx.body);
// //     await ctxFn.flowDynamic("Gracias por registrarte " + state.name);
// //   }
// // );

export { registerOldFlow };
