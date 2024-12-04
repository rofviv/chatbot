import { i18n } from "~/translations";

export default class OrderUtils {
  static parseStatus(status: string) {
    switch (status) {
      case "pending":
        return i18n.t('status.pending');
      case "assigned":
        return i18n.t('status.assigned');
      case "arrived":
        return i18n.t('status.arrived');
      case "dispatched":
        return i18n.t('status.dispatched');
      case "complete":
        return i18n.t('status.complete');
      case "canceled":
        return i18n.t('status.canceled');
      default:
        return status;
    }
  }
}
