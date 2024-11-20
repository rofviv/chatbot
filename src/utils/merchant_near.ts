import { Merchant } from "../services/patio_service_api";

export const merchantNear = async (merchants: Merchant[], latitude: number, longitude: number): Promise<Merchant[]> => {
  const merchantsNear = merchants.filter((merchant) => {
    const distance = calculateDistance(latitude, longitude, merchant.latitude, merchant.longitude);
    merchant.distance_from_client = distance;
    return distance <= merchant.max_distance;
  });
  merchantsNear.sort((a, b) => a.distance_from_client - b.distance_from_client);
  return merchantsNear;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
