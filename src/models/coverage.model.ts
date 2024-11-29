// {"id":20,"name":"SANTA CRUZ","city_id":1,"city":{"id":1,"name":"Santa Cruz"},"acceptOrder":1}
export type CoverageModel = {
  id: number;
  name: string;
  city_id: number;
  city: {
    id: number;
    name: string;
  };
  acceptOrder: number;
};
