// {"id":4553,"name":"Roy","lastname":null,"phone":"59177640286","email":"royvillarroel94@gmail.com","password":"$2b$10$9bSo4Y9O0gmgnwV0rFoDc.LVAczQSDk1FpbHQgvCseefDGnQBhnRq","rating":0,"status":"enabled","wallet":20,"last_login":"2024-03-13T16:11:21.000Z","app_version":null,"device":null,"referred_code":null,"birthday":null,"last_latitude":"0.00000000","last_longitude":"0.00000000","last_sync":null,"role":"customer","city_id":6,"createdAt":"2024-02-02T14:47:09.000Z","updatedAt":"2024-09-24T16:08:36.000Z","timezone_id":1,"order_capacity":0,"photo_url":null,"modality_id":null,"contract_url":null,"signature_url":null,"identity_number":null,"address":null,"extra_amount":0,"payment_option":0,"warranty_amount":0,"bearing":0,"jugno_id":null,"token_notification":null,"otp":965741,"referred_user_id":null,"merchant_id":null,"driver_validate":0,"top_motorcycle":0,"acceptance_rate":1,"type_bonus":0,"is_helper":0,"is_profile_complete":1,"nit":null,"business_name":null,"points":0,"country_code":null,"is_verified_phone":0,"is_verified_email":0,"addresses":[{"id":6,"name":"Adress Test","cityId":1,"address":"Address Test","latitude":-17.798797854405368,"longitude":-63.19796472787857,"coverageId":null,"references":"Address Test"}],"paymentMethods":null,"quantityOrdersActive":0,"notifications":0,"city":{"id":6,"name":"New York","currency":"USD"},"merchant":null}

export type CurrentUserModel = {
  data?: UserModel;
  lastOrder?: string;
  lastDate?: Date;
};

export type UserModel = {
  id: number;
  name: string;
  phone: string;
  email: string;
  quantityOrdersActive: number;
  points: number;
  nit: string;
  business_name: string;
  status: string;
  addresses?: AddressUserModel[];
};

export type AddressUserModel = {
  id?: number;
  name: string;
  address: string;
  references: string;
  latitude: number;
  longitude: number;
  coverageId: number;
  date?: Date;
};
