import { EVENTS } from "@builderbot/bot";

import { addKeyword } from "@builderbot/bot";
import { intentionFlow } from "./intention_flow";
import patioServiceApi from "../services/patio_service_api";
import { saveUser } from "~/services/local_storage";
import { i18n } from "~/translations";


const registerFlow = addKeyword(EVENTS.ACTION).addAnswer(
  i18n.t("register.register_welcome"),
  {
    capture: true,
  },
  async (ctx, { state, endFlow, gotoFlow, fallBack }) => {
    if (ctx.body.toLowerCase() === "si" || ctx.body.toLowerCase() === "yes") {
      return gotoFlow(formRegisterFlow);
    } else if (ctx.body.toLowerCase() === "no" || ctx.body.toLowerCase() === "no") {
      await state.update({ registerPosponed: true });
      endFlow(i18n.t("register.register_posponed"));
      return gotoFlow(intentionFlow);
    } else {
      return fallBack(i18n.t("register.register_fallback"));
    }
  }
);

const formRegisterFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(i18n.t("register.register_accept"))
  .addAnswer(
    i18n.t("register.register_name"),
    { capture: true, delay: 1500 },
    async (ctx, { state, flowDynamic }) => {
      await state.update({ name: ctx.body });
      return flowDynamic("Perfecto " + ctx.body);
    }
  )
  .addAnswer(
    i18n.t("register.register_email"),
    { capture: true, delay: 2000 },
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
    { delay: 1500 },
    async (ctx, { state, endFlow, gotoFlow }) => {
      const phone = ctx.from;
      const name = state.get("name");
      const email = state.get("email");
      const user = await patioServiceApi.createUser(phone, name, email);
      if (user) {
        endFlow(i18n.t("register.success"));
        await saveUser(state, {
          data: user,
          lastOrder: undefined,
          lastDate: new Date(),
        });
        ctx.body = i18n.t("hello");
        return gotoFlow(intentionFlow);
      } else {
        return endFlow(i18n.t("register.error"));
      }
    }
  );

export { registerFlow, formRegisterFlow };
