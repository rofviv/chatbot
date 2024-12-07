// {
//     "message": {
//         "body": "Texto de la respuesta",
//         "media": "url de la foto del producto si es necesario"
//     },
//     "view_menu": "true" o "false", // Si es true el usuario quiere ver el menu nuevamente
//     "is_finish": "true" o "false", // Si es true el usuario quiere finalizar el pedido,
//     "view_delivery_cost": "true" o "false" // Si es true el usuario quiere saber el costo de envío,
// }
export type AIResponse = {
  message: {
    body: string;
    media: string;
  };
  view_menu: boolean;
  is_finish: boolean;
  cancel_order: boolean;
};

// {
//   "products": [
//       {
//           "quantity": 1, // cantidad del producto nuevo agregado
//           "productId": 1, // id del producto nuevo agregado
//           "price": 0, // precio del producto nuevo agregado
//           "name": "nombre del producto nuevo agregado",
//           "toppings": [
//               {
//                   "toppingId": 1, // id del topping nuevo agregado
//                   "toppingName": "nombre del topping nuevo agregado",
//                   "subToppingId": 1, // id del subTopping nuevo agregado
//                   "subToppingName": "nombre del subTopping nuevo agregado",
//                   "price": 0 // precio del topping nuevo agregado
//               }
//           ]
//       }
//   ]
// }
export type AIResponseFinish = {
  products: ProductAIResponse[];
};
type ProductAIResponse = {
  quantity: number;
  productId: number;
  price: number;
  name: string;
  toppings: ToppingAIResponse[];
};
type ToppingAIResponse = {
  toppingId: number;
  toppingName: string;
  subToppingId: number;
  subToppingName: string;
  price: number;
};
