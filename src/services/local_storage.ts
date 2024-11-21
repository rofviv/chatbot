import { BotStateStandAlone } from "@builderbot/bot/dist/types";
import patioServiceApi from "./patio_service_api";
import { CurrentUser, UserModel } from "~/models/user";

export const saveUser = async (phone: string, user: UserModel) => {
  const userInfo = await patioServiceApi.getUser(phone);
  if (!userInfo) {
    // await patioServiceApi.createUser(user);
  }
};

export const getUser = async (
  state: BotStateStandAlone
): Promise<CurrentUser | undefined> => {
  return state.get("user") as CurrentUser | undefined;
};
