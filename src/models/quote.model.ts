export type QuoteModel = {
  minPickupDuration: number;
  maxPickupDuration: number;
  distance: number;
  currency: string;
  baseCost?: number;
  extraCost?: number;
  currentDate: string;
  coverageId: number;
  estimatePickupTime: string;
  estimateDeliveryTime: string;
  provider: string;
  fareMerchant: number;
};
