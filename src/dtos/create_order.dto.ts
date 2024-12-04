// {"from_address_geocoder":"Ramada, calle 1","to_address_geocoder":"Abasto, calle 2","from_address":"calle 1","from_latitude":-17.76440526172838,"from_longitude":-63.159808655543394,"to_address":"calle 2","to_latitude":-17.775360155647963,"to_longitude":-63.14877959317966,"h3_hexagon_id":"string","phone_user":"59177399398","name_user":"Matias Flores R.","tip":10,"total":1,"discount":0,"city_id":1,"merchant_id":1,"paymentModeId":1,"userId":1,"coverageId":1,"details":[{"quantity":3,"price":34.4,"productId":1,"notes":"string","toppings":[{"quantity":3,"price":34.4,"toppingName":"Enzalada","subToppingName":"Enzalada simple","toppingId":1,"subToppingId":1}],"subtotal":103.2}],"comment":"3 burger extra grande","orderProvider":"provider","providerId":"123","tipOriginal":0,"createdAt":"2024-11-29T14:33:43.242Z","currency":"string","baseCost":0,"extraCost":0,"vehicleTypeId":1,"storeName":"Store Test","isPickup":0,"point":0,"isTest":0,"subProvider":"string","providerImage":"string","nit":"string","businessName":"string"}

export type CreateOrderDto = {
  from_address_geocoder: string;
  to_address_geocoder: string;
  from_address: string;
  from_latitude: number;
  from_longitude: number;
  to_address: string;
  to_latitude: number;
  to_longitude: number;
  h3_hexagon_id: string;
  phone_user: string;
  name_user: string;
  tip: number;
  total: number;
  discount: number;
  city_id: number;
  merchant_id: number;
  paymentModeId: number;
  userId: number;
  coverageId: number;
  details: DetailCreateOrderDto[];
  comment?: string;
  orderProvider: string;
  providerId?: string;
  tipOriginal: number;
  createdAt?: string;
  currency: string;
  baseCost?: number;
  extraCost?: number;
  vehicleTypeId: number;
  storeName: string;
  isPickup: number;
  point?: number;
  isTest?: number;
  subProvider?: string;
  providerImage?: string;
  nit?: string;
  businessName?: string;
};

export type DetailCreateOrderDto = {
  quantity: number;
  productId: number;
  price: number;
  notes?: string;
  toppings?: {
    quantity: number;
    toppingId: number;
    toppingName: string;
    subToppingId: number;
    subToppingName: string;
    price: number;
  }[];
  subtotal?: number;
};
