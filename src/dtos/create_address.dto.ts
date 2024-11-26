/*
{
  "name": "string",
  "address": "string",
  "references": "string",
  "latitude": -17.792763,
  "longitude": -63.183266,
  "userId": 1,
  "cityId": 1,
  "coverageId": 1
}
*/

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
