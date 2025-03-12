export interface CreateAddressDto {
  name: string;
  address: string;
  references: string;
  latitude: number;
  longitude: number;
  userId: number;
  cityId: number;
  coverageId: number;
}
