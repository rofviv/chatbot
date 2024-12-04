export type CurrentOrderModel = {
  id: number;
  status: string;
};

export type OrderModel = {
  id: string;
  store_name?: string;
  storeName?: string;
  status: string;
  deliveryTrackingUrl: string;
};
