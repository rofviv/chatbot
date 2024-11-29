import { BotStateGlobal, BotStateStandAlone } from "@builderbot/bot/dist/types";
import { CurrentUserModel } from "~/models/user.model";
import { CurrentOrderModel } from "~/models/order.model";
import { MerchantModel } from "~/models/merchant.model";
import { AddressUserModel } from "~/models/user.model";

export const saveUser = async (state: BotStateStandAlone, user: CurrentUserModel) => {
  await state.update({ user: user });
};

export const getUser = async (
  state: BotStateStandAlone
): Promise<CurrentUserModel | undefined> => {
  return state.get("user") as CurrentUserModel | undefined;
};

export const getMenuGlobal = async (
  globalState: BotStateGlobal
): Promise<string | undefined> => {
  return globalState.get("menuGlobal") as string | undefined;
};

export const getMerchantsGlobal = async (
  globalState: BotStateGlobal
): Promise<MerchantModel[] | []> => {
  return globalState.get("merchantsGlobal") as MerchantModel[] | [];
};

export const saveMerchantsGlobal = async (
  globalState: BotStateGlobal,
  merchants: MerchantModel[]
) => {
  globalState.update({ merchantsGlobal: merchants });
};

export const saveMenuGlobal = async (
  globalState: BotStateGlobal,
  menu: string
) => {
  globalState.update({ menuGlobal: menu });
};

export const getOrderCurrent = async (
  state: BotStateStandAlone
): Promise<CurrentOrderModel | undefined> => {
  return state.get("currentOrder") as CurrentOrderModel | undefined;
};

export const saveOrderCurrent = async (
  state: BotStateStandAlone,
  order: CurrentOrderModel
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
  merchants: MerchantModel[]
) => {
  state.update({ merchantsNear: merchants });
};

export const getMerchantsNearByUser = async (
  state: BotStateStandAlone
): Promise<MerchantModel[] | undefined> => {
  return state.get("merchantsNear") as MerchantModel[] | undefined;
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
