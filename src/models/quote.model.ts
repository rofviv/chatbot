// {"minPickupDuration":5,"maxPickupDuration":10,"distance":0.729,"currency":"BOB","baseCost":9,"extraCost":0,"currentDate":"2024-11-29T14:52:49.386Z","coverageId":20,"estimatePickupTime":"2024-11-29T15:00:19.386Z","estimateDeliveryTime":"2024-11-29T15:08:02.386Z","provider":"googlemaps","fareMerchant":7}

export type QuoteModel = {
  minPickupDuration: number;
  maxPickupDuration: number;
  distance: number;
  currency: string;
  baseCost: number;
  extraCost: number;
  currentDate: string;
  coverageId: number;
  estimatePickupTime: string;
  estimateDeliveryTime: string;
  provider: string;
  fareMerchant: number;
};
