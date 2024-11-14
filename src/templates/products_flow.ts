import { addKeyword, EVENTS } from "@builderbot/bot";
import PatioServiceApi from "../services/patio_service_api";

export const productsFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { state, endFlow, gotoFlow }) => {
    const products = await PatioServiceApi.getProducts(31970);
    if (products.length === 0) {
      return endFlow(
        "No hay productos disponibles en este momento, por favor intenta mas tarde"
      );
    }
    const groupedProducts = products.reduce((acc, product) => {
      const category = product.merchants_sub_categories[0].name;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(`${product.name} - ${product.price} Bs.`);
      return acc;
    }, {});
    return endFlow(
      Object.keys(groupedProducts)
        .map((category) => {
          return `*${category}*\n${groupedProducts[category].join("\n")}`;
        })
        .join("\n\n")
    );
  }
);
