import { EVENTS } from "@builderbot/bot";
import { addKeyword } from "@builderbot/bot";
import patioServiceApi from "../services/patio_service_api";
import { i18n } from "~/translations";
import LocalStorage from "~/services/local_storage";
import Constants from "~/utils/constants";
import { config } from "~/config";
import { optionsFlow } from "./options_flow";

const formRegisterFlow = addKeyword(EVENTS.ACTION)
  .addAnswer("Hola 👋 bienvenido! soy un bot 🤖 ingeligente que toma pedidos y gestiona la logistica 🛵", { delay: Constants.delayMessage })
  .addAnswer(
    i18n.t("register.register_name"),
    { capture: true, delay: Constants.delayMessage },
    async (ctx, { state, flowDynamic }) => {
      await state.update({ name: ctx.body });
      return flowDynamic("Perfecto " + ctx.body + "! 👍", { delay: Constants.delayMessage });
    }
  )
  .addAction(
    async (ctx, { state, endFlow, gotoFlow }) => {
      const phone = ctx.from;
      const name = state.get("name");
      const email = phone + "@" + config.domain;
      const user = await patioServiceApi.createUser(phone, name, email);
      if (user) {
        await LocalStorage.saveUser(state, {
          data: user,
          lastOrder: undefined,
          lastDate: new Date(),
        });
        return gotoFlow(optionsFlow);
      } else {
        return endFlow(i18n.t("register.error"));
      }
    }
  );

export { formRegisterFlow };
