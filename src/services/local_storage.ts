import { BotStateGlobal, BotStateStandAlone } from "@builderbot/bot/dist/types";
import { CurrentUser } from "~/models/user";
import { CurrentOrder } from "~/models/order";
import { Merchant } from "~/models/merchat";
import { AddressUserModel } from "~/models/user";

export const saveUser = async (state: BotStateStandAlone, user: CurrentUser) => {
  await state.update({ user: user });
};

export const getUser = async (
  state: BotStateStandAlone
): Promise<CurrentUser | undefined> => {
  return state.get("user") as CurrentUser | undefined;
};

export const getMenuGlobal = async (
  globalState: BotStateGlobal
): Promise<string | undefined> => {
  return globalState.get("menuGlobal") as string | undefined;
};

export const saveMenuGlobal = async (
  globalState: BotStateGlobal,
  menu: string
) => {
  globalState.update({ menuGlobal: menu });
};

export const getOrderCurrent = async (
  state: BotStateStandAlone
): Promise<CurrentOrder | undefined> => {
  return state.get("currentOrder") as CurrentOrder | undefined;
};

export const saveOrderCurrent = async (
  state: BotStateStandAlone,
  order: CurrentOrder
) => {
  state.update({ currentOrder: order });
};

export const clearOrderCurrent = async (
  state: BotStateStandAlone
) => {
  state.update({ currentOrder: undefined });
};

export const getRegisterPosponed = async (
  state: BotStateStandAlone
): Promise<boolean | undefined> => {
  return state.get("registerPosponed") as boolean | undefined;
};

export const saveMerchantsNearByUser = async (
  state: BotStateStandAlone,
  merchants: Merchant[]
) => {
  state.update({ merchantsNear: merchants });
};

export const getMerchantsNearByUser = async (
  state: BotStateStandAlone
): Promise<Merchant[] | undefined> => {
  return state.get("merchantsNear") as Merchant[] | undefined;
};

export const getAddressCurrent = async (
  state: BotStateStandAlone
): Promise<AddressUserModel | undefined> => {
  return state.get("address") as AddressUserModel | undefined;
};

export const saveAddressCurrent = async (
  state: BotStateStandAlone,
  address: AddressUserModel
) => {
  state.update({ address });
};
