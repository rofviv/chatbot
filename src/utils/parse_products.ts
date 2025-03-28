import { ProductModel, SubToppingModel, ToppingModel } from "~/models/product.model";

export default class ProductUtils {
  static productsParseText(products: ProductModel[]) {
    const groupedProducts = products.reduce((acc, product) => {
      const category = product.merchants_sub_categories[0].name;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(
        `id: ${product.id} - name: ${product.name} - price: ${product.price} - media: ${product.photo}\nToppings: ${
          product.toppings.length > 0
            ? product.toppings
                .map(
                  (topping: ToppingModel) =>
                    "toppingId: " + topping.id + " - toppingName: " + topping.name + " - minLimit: " + topping.limit + " - maxLimit: " + topping.maxLimit +
                    (topping.sub_toppings
                      ? `\n${topping.sub_toppings
                          .map(
                            (subTopping: SubToppingModel) =>
                              "subToppingId: " + subTopping.id + " - subToppingName: " + subTopping.name + " - subToppingPrice: " + subTopping.price
                          )
                          .join("\n")}`
                      : "")
                )
                .join(", ")
            : "sin toppings"
        }`
      );
      return acc;
    }, {});

    return Object.keys(groupedProducts)
      .map((category) => {
        return `*${category}*\n${groupedProducts[category].join("\n")}`;
      })
      .join("\n\n");
  }

  static parseCategories(products: ProductModel[]) {
    const groupedCategory = products.reduce((acc, product) => {
      const category = product.merchants_sub_categories[0].name;
      const order = product.merchants_sub_categories[0].order;
      if (!acc[category]) {
        acc[category] = {
          name: category,
          order: order
        };
      }
      return acc;
    }, {});

    return Object.entries(groupedCategory)
      .sort(([,a], [,b]) => (b as any).order - (a as any).order)
      .map(([category]) => {
        return `*${category}*`;
      })
      .join("\n");
  }
}