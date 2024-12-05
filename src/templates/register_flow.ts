import { EVENTS } from "@builderbot/bot";
import { addKeyword } from "@builderbot/bot";
import patioServiceApi from "../services/patio_service_api";
import { i18n } from "~/translations";
import { addressFlow } from "./address_flow";
import LocalStorage from "~/services/local_storage";
import Constants from "~/utils/constants";
import { orderFlow } from "./order_flow";
import { finishOrderFlow } from "./finish_order_flow";

const registerFlow = addKeyword(EVENTS.ACTION).addAnswer(
  i18n.t("register.register_welcome"),
  {
    capture: true,
    delay: Constants.delayMessage,
  },
  async (ctx, { state, gotoFlow, fallBack }) => {
    if (ctx.body.toLowerCase() === "si" || ctx.body.toLowerCase() === "yes") {
      return gotoFlow(formRegisterFlow);
    } else if (ctx.body.toLowerCase() === "no" || ctx.body.toLowerCase() === "no") {
      await state.update({ registerPosponed: true });
      await state.update({
        onlyAddress: true,
      });
      return gotoFlow(addressFlow);
    } else {
      return fallBack(i18n.t("register.register_fallback"));
    }
  }
);

const formRegisterFlow = addKeyword(EVENTS.ACTION)
  // .addAnswer(i18n.t("register.register_accept"), { delay: Constants.delayMessage })
  .addAction(
    async (ctx, { state, flowDynamic }) => {
      const products = await state.get("products");
      if (products) {
        return flowDynamic("Antes de finalizar, tengo que registrarte", { delay: Constants.delayMessage });
      }
      return flowDynamic(i18n.t("register.register_accept"), { delay: Constants.delayMessage });
    }
  )
  .addAnswer(
    i18n.t("register.register_name"),
    { capture: true, delay: Constants.delayMessage },
    async (ctx, { state, flowDynamic }) => {
      await state.update({ name: ctx.body });
      return flowDynamic("Perfecto " + ctx.body, { delay: Constants.delayMessage });
    }
  )
  .addAnswer(
    i18n.t("register.register_email"),
    { capture: true, delay: Constants.delayMessage },
    async (ctx, { state, fallBack }) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ctx.body)) {
        return fallBack(i18n.t("register.register_email_invalid"));
      }
      const exists = await patioServiceApi.verifyExistsEmail(ctx.body);
      if (exists) {
        return fallBack(i18n.t("register.register_email_exists"));
      }
      await state.update({ email: ctx.body });
    }
  )
  .addAnswer(
    i18n.t("register.register_saving"),
    { delay: Constants.delayMessage, },
    async (ctx, { state, endFlow, gotoFlow }) => {
      const phone = ctx.from;
      const name = state.get("name");
      const email = state.get("email");
      const user = await patioServiceApi.createUser(phone, name, email);
      if (user) {
        await LocalStorage.saveUser(state, {
          data: user,
          lastOrder: undefined,
          lastDate: new Date(),
        });
        const currentAddress = await LocalStorage.getAddressCurrent(state);
        if (!currentAddress) {
          return gotoFlow(addressFlow);
        } else {
          const products = await state.get("products");
          if (products) {
            return gotoFlow(finishOrderFlow);
          } else {
            ctx.body = "Muestrame el menu";
            return gotoFlow(orderFlow);
          }
        }
      } else {
        return endFlow(i18n.t("register.error"));
      }
    }
  );

export { registerFlow, formRegisterFlow };
