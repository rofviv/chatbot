import { ProductModel } from "~/models/product.model";

export function productsParseText(products: ProductModel[]) {
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.merchants_sub_categories[0].name;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(
        `*${product.name} - ${product.price} Bs.*\n${product.toppings
          .map(
            (topping: any) =>
              topping.name +
              (topping.sub_toppings
                ? `\n${topping.sub_toppings
                    .map(
                      (subTopping: any) =>
                        subTopping.name + " - " + subTopping.price + " Bs."
                    )
                    .join("\n")}`
                : "")
          )
          .join(", ")}`
      );
      return acc;
    }, {});
    return Object.keys(groupedProducts)
      .map((category) => {
        return `*${category}*\n${groupedProducts[category].join("\n")}`;
      })
      .join("\n\n");
  };