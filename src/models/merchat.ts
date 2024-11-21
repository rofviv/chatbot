// {"id":30853,"name":"Burger King - Banzer","latitude":-17.755003769323586,"longitude":-63.17687920114555,"max_distance":12,"coverage_cell_id":"888b221a39fffff","photo":"https://storage-patiodriver.s3.amazonaws.com/1730910511782.png","address":"Av, Cristo Redentor, entre 3er. y 4to. anillo, esquina Manuel Marco, 6RWF+572, Santa Cruz de la Sierra, Bolivia","state":"online","groupChat":"PATIO BURGER KING","externalId":"30853","readyAssignment":0,"phone":"59170516039","orderCapacity":0,"discountTip":0,"timeReady":10,"activateReady":0,"orderType":2,"photoBanner":"https://storage-patiodriver.s3.amazonaws.com/1708875169781.jpg","commissionPercentage":8,"pickupPercentage":0,"isVisible":1,"firstDeliveryId":null,"email":"burgerkingbanzer@patio.com","autoAccept":0,"topPriority":100,"multiplyPoints":1,"paymentCash":1,"paymentQr":0,"motoclickAvailable":0,"coverageId":20,"coverageReportId":12,"clientId":568,"hourStart":null,"hourEnd":null,"hasMenu":1,"logo":"https://storage-patiodriver.s3.amazonaws.com/1708875167362.jpg","zoneId":101,"topCategoryId":1,"sectionId":1,"createdAt":"2027-03-24T10:00:00.000Z","updatedAt":"2024-11-19T11:28:07.000Z"}
export type Merchant = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  max_distance: number;
  paymentCash: number;
  paymentQr: number;
  distance_from_client?: number;
};
