import { addKeyword, EVENTS } from "@builderbot/bot";
import patioServiceApi from "~/services/patio_service_api";
import LocalStorage from "~/services/local_storage";
import Constants from "~/utils/constants";
import { currentAddressFlow, newAddressFlow } from "./address_flow";
import { formRegisterFlow } from "./register_flow";

export const finishOrderFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, gotoFlow, endFlow }) => {
    const currentUser = await LocalStorage.getUser(state);
    if (!currentUser) {
      return gotoFlow(formRegisterFlow);
    }
    const verifyAddress = await state.get("verifyAddress");
    if (verifyAddress) {
      if (
        currentUser &&
        currentUser.data.addresses &&
        currentUser.data.addresses.length > 0
      ) {
        return gotoFlow(currentAddressFlow);
      // } else if (
      //   currentUser &&
      //   currentUser.data.addresses &&
      //   currentUser.data.addresses.length == 1
      // ) {
      //   return gotoFlow(confirmAddressFlow);
      } else {
        return gotoFlow(newAddressFlow);
      }
    }
    const products = await state.get("products");
    const currentAddress = await LocalStorage.getAddressCurrent(state);
    const merchants = await LocalStorage.getMerchantsNearByUser(state);
    const merchant = merchants[0];

    const total = products.reduce((acc, product) => acc + product.price, 0);

    try {
      const res = await patioServiceApi.createOrder({
        from_address_geocoder: merchant.address,
        from_address: merchant.address,
        from_latitude: merchant.latitude,
        from_longitude: merchant.longitude,
        to_address_geocoder: currentAddress.address,
        to_address: currentAddress.address,
        to_latitude: currentAddress.latitude,
        to_longitude: currentAddress.longitude,
        h3_hexagon_id: "1",
        phone_user: currentUser.data.phone,
        name_user: currentUser.data.name,
        tip: 0,
        total: total,
        discount: 0,
        city_id: 1,
        merchant_id: merchant.id,
        paymentModeId: 1,
        userId: currentUser.data.id,
        coverageId: currentAddress.coverageId,
        details: products.map((product: any) => ({
          quantity: product.quantity,
          productId: product.productId,
          price: product.price,
          toppings: product.toppings.map((topping: any) => ({
            quantity: 1,
            toppingId: topping.toppingId,
            toppingName: topping.toppingName,
            subToppingId: topping.subToppingId,
            subToppingName: topping.subToppingName,
            price: topping.price,
          })),
        })),
        //   comment: "Generate by builderbot",
        orderProvider: Constants.providerName,
        tipOriginal: 0,
        currency: "BOB",
        vehicleTypeId: Constants.vehicleType_motorcycle,
        storeName: merchant.name,
        isPickup: 0,
        providerImage: Constants.providerImage,
        //   nit: "",
        //   businessName: "",
      });
      // TODO: save order in local storage
      if (typeof res === "string") {
        return endFlow(res);
      }
      
      return endFlow(`
¡Tu pedido *#${res.id}* ha sido confirmado! 🚀 Estamos preparando todo para que llegue a ti lo antes posible.

📍 Puedes rastrear tu pedido en tiempo real haciendo clic en el siguiente enlace:
${res.deliveryTrackingUrl}
`);

    } catch (error) {
      console.log(error);
      return endFlow("Error al realizar el pedido");
    }
  }
);
