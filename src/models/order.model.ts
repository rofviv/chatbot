export type CurrentOrderModel = {
  id: number;
  status: string;
  date?: Date;
};

export type OrderModel = {
  id: string;
  store_name?: string;
  storeName?: string;
  status: string;
  deliveryTrackingUrl: string;
};
