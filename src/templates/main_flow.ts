import { addKeyword, EVENTS } from "@builderbot/bot";
import { intentionFlow } from "./intention_flow";
import patioServiceApi from "../services/patio_service_api";
import { registerFlow } from "./register_flow";
import { orderFlow } from "./order_flow";
import { merchantDefaultId } from "~/utils/constants";

type CurrentUser = {
  name?: string;
  phone?: string;
  lastOrder?: string;
  lastDate?: Date;
};

export type LocationGPS = {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
};

type Order = {
  id: number;
  status: string;
};

const mainFlow = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { state, globalState, flowDynamic, gotoFlow }) => {

    const menuGlobal = globalState.get("menuGlobal") as string | undefined;
    if (!menuGlobal) {
      const menu = await patioServiceApi.getProducts(merchantDefaultId);
      console.log("menuGlobal: ", menu.length);
      globalState.update({ menuGlobal: JSON.stringify(menu) });
    }

    const phone = ctx.from;
    console.log("Phone", phone);
    const currentUser = state.get(phone) as CurrentUser | undefined;
    const order = state.get("order") as Order | undefined;
    if (order) {
      return gotoFlow(orderFlow);
    }
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
          `Hola! ${userInfo.name}, bienvenido de vuelta`
        );
        return gotoFlow(intentionFlow);
      }
    } else {
      const lastDate = currentUser.lastDate;
      const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
      const fiveMinutes = 300000; // 5 minutos en milisegundos
      if (diffTime > fiveMinutes) {
        await flowDynamic(
          `Hola! ${currentUser.name}, gracias por volver a contactarnos`
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
