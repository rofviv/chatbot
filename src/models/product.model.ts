// {"id":198996,"name":"Económico Broasted","description":"Económico Broasted","price":20,"colors":null,"measure":null,"weight":null,"size":null,"photo":"https://i.ibb.co/vzF4dsC/eco-Broasted-pierna.png","status":"online","isOffer":0,"days":"0,1,2,3,4,5,6","merchantId":31970,"commissionPercentage":null,"pickupPercentage":null,"isPoint":0,"stock":null,"order":1,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":"2024-07-06T17:28:14.000Z","toppings":[{"id":58142,"name":"Cubiertos","order":1,"limit":1,"maxLimit":1,"type":"simple","productId":198996,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":null,"sub_toppings":[{"id":380321,"name":"Si","order":1,"price":1,"toppingId":58142,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":null},{"id":380323,"name":"No","order":1,"price":0,"toppingId":58142,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":null}]},{"id":58143,"name":"Elige Tus Salsas Favoritas","order":1,"limit":1,"maxLimit":3,"type":"multi","productId":198996,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null,"sub_toppings":[{"id":380325,"name":"Salsa De La Casa 50 Gr","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380326,"name":"Salsa De Ají 9 Gr","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380327,"name":"Salsa De Ajo 9 Gr","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380328,"name":"Frejol 100 Ml","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380330,"name":"Escabeche 50 Ml","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380332,"name":"Locoto 50 Ml","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null}]},{"id":58146,"name":"Seleccione Presa Económico Broasted","order":1,"limit":1,"maxLimit":1,"type":"multi","productId":198996,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null,"sub_toppings":[{"id":380334,"name":"Pierna Broasted","order":1,"price":0,"toppingId":58146,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380336,"name":"Contra Pierna Broasted","order":1,"price":0,"toppingId":58146,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null}]},{"id":58147,"name":"Seleccione Presa Extra Broasted","order":1,"limit":0,"maxLimit":4,"type":"multi","productId":198996,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null,"sub_toppings":[{"id":380339,"name":"Presa Extra Pierna 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380341,"name":"Presa Extra Contra Pierna 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380343,"name":"Presa Extra Pecho 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380344,"name":"Presa Extra Ala 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null}]}],"merchants_sub_categories":[{"id":134702,"name":"Pollo leña & broasted","merchantId":31970,"subCategoryId":906,"productId":198996,"order":1,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":"2024-07-06T17:28:14.000Z"}]}
export type ProductModel = {
  id: number;
  name: string;
  price: number;
  photo?: string;
  isOffer: number;
  toppings: ToppingModel[];
  merchants_sub_categories: MerchantSubCategoryModel[];
};

export type MerchantSubCategoryModel = {
  id: number;
  name: string;
  order: number;
};

export type ToppingModel = {
  id: number;
  name: string;
  limit: number;
  maxLimit: number;
  type: string;
  sub_toppings: SubToppingModel[];
};

export type SubToppingModel = {
  id: number;
  name: string;
  price: number;
  toppingId: number;
};