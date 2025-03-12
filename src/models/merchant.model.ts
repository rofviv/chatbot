export type MerchantModel = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  max_distance: number;
  paymentCash: number;
  paymentQr: number;
  distance_from_client?: number;
};
