import { BotStateGlobal, BotStateStandAlone } from "@builderbot/bot/dist/types";
import { CurrentUserModel } from "~/models/user.model";
import { CurrentOrderModel } from "~/models/order.model";
import { MerchantModel } from "~/models/merchant.model";
import { AddressUserModel } from "~/models/user.model";

export default class LocalStorage {
  static async saveUser(state: BotStateStandAlone, user: CurrentUserModel): Promise<void> {
    await state.update({ user: user });
  }

  static async getUser(state: BotStateStandAlone): Promise<CurrentUserModel | undefined> {
    return state.get("user") as CurrentUserModel | undefined;
  }

  static async getMenuGlobal(globalState: BotStateGlobal): Promise<string | undefined> {
    return globalState.get("menuGlobal") as string | undefined;
  }

  static async getMerchantsGlobal(globalState: BotStateGlobal): Promise<MerchantModel[] | []> {
    return globalState.get("merchantsGlobal") as MerchantModel[] | [];
  }

  static async saveMerchantsGlobal(globalState: BotStateGlobal, merchants: MerchantModel[]): Promise<void> {
    await globalState.update({ merchantsGlobal: merchants });
  }

  static async saveMenuGlobal(globalState: BotStateGlobal, menu: string): Promise<void> {
    await globalState.update({ menuGlobal: menu });
  }

  static async getOrderCurrent(state: BotStateStandAlone): Promise<CurrentOrderModel | undefined> {
    return state.get("currentOrder") as CurrentOrderModel | undefined;
  }

  static async saveOrderCurrent(state: BotStateStandAlone, order: CurrentOrderModel): Promise<void> {
    await state.update({ currentOrder: { ...order, date: new Date() } });
  }

  static async clearOrderCurrent(state: BotStateStandAlone): Promise<void> {
    await state.update({ currentOrder: undefined });
  }

  static async getRegisterPosponed(state: BotStateStandAlone): Promise<boolean | undefined> {
    return state.get("registerPosponed") as boolean | undefined;
  }

  static async saveMerchantsNearByUser(state: BotStateStandAlone, merchants: MerchantModel[]): Promise<void> {
    await state.update({ merchantsNear: merchants });
  }

  static async getMerchantsNearByUser(state: BotStateStandAlone): Promise<MerchantModel[] | undefined> {
    return state.get("merchantsNear") as MerchantModel[] | undefined;
  }

  static async getAddressCurrent(state: BotStateStandAlone): Promise<AddressUserModel | undefined> {
    return state.get("address") as AddressUserModel | undefined;
  }

  static async saveAddressCurrent(state: BotStateStandAlone, address: AddressUserModel): Promise<void> {
    await state.update({ address: { ...address, date: new Date() } });
  }
}
