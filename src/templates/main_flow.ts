import { i18n, Language } from "~/translations";
import { addKeyword, EVENTS } from "@builderbot/bot";
import { intentionFlow } from "./intention_flow";
import patioServiceApi from "../services/patio_service_api";
import { orderFlow } from "./order_flow";
import { config } from "~/config";
import LocalStorage from "~/services/local_storage";
import Constants from "~/utils/constants";

i18n.setLanguage(config.defaultLanguage as Language);

const mainFlow = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { state, globalState, flowDynamic, gotoFlow }) => {
    const menuGlobal = await LocalStorage.getMenuGlobal(globalState);
    if (!menuGlobal) {
      const menu = await patioServiceApi.getProducts(Constants.merchantDefaultId);
      console.log("menuGlobal: ", menu.length);
      LocalStorage.saveMenuGlobal(globalState, JSON.stringify(menu));
    }

    const merchantsGlobal = await LocalStorage.getMerchantsGlobal(globalState);
    if (!merchantsGlobal) {
      const merchants = await patioServiceApi.merchantsByClient(Constants.clientMerchantId);
      console.log("merchantsGlobal: ", merchants.length);
      LocalStorage.saveMerchantsGlobal(globalState, merchants);
    }

    const phone = ctx.from;
    console.log("Phone", phone);
    const currentOrder = await LocalStorage.getOrderCurrent(state);
    if (currentOrder) {
      return gotoFlow(orderFlow);
    }
    const currentUser = await LocalStorage.getUser(state);
    if (!currentUser) {
      const userInfo = await patioServiceApi.getUser(phone);
      if (!userInfo) {
        return gotoFlow(intentionFlow);
      } else {
        await LocalStorage.saveUser(state, {
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
      await LocalStorage.saveUser(state, {
        ...currentUser,
        lastDate: new Date(),
      });
      if (diffTime > fiveMinutes) {
        await flowDynamic(
          `Hola! ${currentUser.data?.name}, gracias por volver a contactarnos`
        );
      }
      return gotoFlow(intentionFlow);
    }
  }
);

export { mainFlow };
