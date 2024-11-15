import { addKeyword, EVENTS } from "@builderbot/bot";
import { intentionFlow } from "./intention_flow";
import patioServiceApi from "../services/patio_service_api";
import { registerFlow } from "./register_flow";

type currentUser = {
  name?: string;
  phone?: string;
  lastOrder?: string;
  lastDate?: Date;
};

const mainFlow = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    const phone = ctx.from;
    console.log("Phone", phone);
    const currentUser = state.get(phone) as currentUser | undefined;
    if (!currentUser) {
      const userInfo = await patioServiceApi.getUser(phone);
      if (!userInfo) {
        const registerPosponed = state.get("registerPosponed") as
          | boolean
          | false;
        if (!registerPosponed) {
          return gotoFlow(registerFlow);
        } else {
          return gotoFlow(intentionFlow);
        }
      } else {
        await state.update({
          [phone]: {
            name: userInfo.name,
            phone,
            lastDate: new Date(),
          },
        });
        await flowDynamic(
          `Hola! ${userInfo.name}, bienvenido de vuelta. ¿Que deseas hacer hoy?`
        );
        return gotoFlow(intentionFlow);
      }
    } else {
      const lastDate = currentUser.lastDate;
      const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
      const fiveMinutes = 300000; // 5 minutos en milisegundos
      if (diffTime > fiveMinutes) {
        await flowDynamic(
          `Hola! ${currentUser.name}, hace un rato que no contactaste con nosotros. ¿Que deseas hacer hoy?`
        );
      } else {
        await state.update({
          [phone]: {
            ...currentUser,
            lastDate: new Date(),
          },
        });
      }
      return gotoFlow(intentionFlow);
    }
  }
);

export { mainFlow };
