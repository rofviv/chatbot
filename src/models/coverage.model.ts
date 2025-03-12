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
