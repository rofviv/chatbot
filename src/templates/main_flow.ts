import { i18n, Language } from "~/translations";
import { addKeyword, EVENTS } from "@builderbot/bot";
import { intentionFlow } from "./intention_flow";
import patioServiceApi from "../services/patio_service_api";
import { registerFlow } from "./register_flow";
import { orderFlow } from "./order_flow";
import { merchantDefaultId } from "~/utils/constants";
import {
  getMenuGlobal,
  getOrderCurrent,
  getRegisterPosponed,
  getUser,
  saveMenuGlobal,
  saveUser,
} from "~/services/local_storage";
import { config } from "~/config";

i18n.setLanguage(config.defaultLanguage as Language);

const mainFlow = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { state, globalState, flowDynamic, gotoFlow }) => {
    const menuGlobal = await getMenuGlobal(globalState);
    if (!menuGlobal) {
      const menu = await patioServiceApi.getProducts(merchantDefaultId);
      console.log("menuGlobal: ", menu.length);
      saveMenuGlobal(globalState, JSON.stringify(menu));
    }

    const phone = ctx.from;
    console.log("Phone", phone);
    const currentOrder = await getOrderCurrent(state);
    if (currentOrder) {
      return gotoFlow(orderFlow);
    }
    const currentUser = await getUser(state);
    if (!currentUser) {
      const userInfo = await patioServiceApi.getUser(phone);
      if (!userInfo) {
        const registerPosponed = await getRegisterPosponed(state);
        if (!registerPosponed) {
          return gotoFlow(registerFlow);
        } else {
          return gotoFlow(intentionFlow);
        }
      } else {
        await saveUser(state, {
          data: userInfo,
          lastOrder: undefined,
          lastDate: new Date(),
        });
        await flowDynamic(`Hola! ${userInfo.name}, bienvenido de vuelta`);
        return gotoFlow(intentionFlow);
      }
    } else {
      const lastDate = currentUser.lastDate;
      const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
      const fiveMinutes = 300000; // 5 minutos en milisegundos
      if (diffTime > fiveMinutes) {
        await flowDynamic(
          `Hola! ${currentUser.data?.name}, gracias por volver a contactarnos`
        );
      } else {
        await saveUser(state, {
          ...currentUser,
          lastDate: new Date(),
        });
      }
      return gotoFlow(intentionFlow);
    }
  }
);

export { mainFlow };
