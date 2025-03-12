export type ProductModel = {
  id: number;
  name: string;
  price: number;
  photo?: string;
  isOffer: number;
  toppings: ToppingModel[];
  merchants_sub_categories: MerchantSubCategoryModel[];
};

export type MerchantSubCategoryModel = {
  id: number;
  name: string;
  order: number;
};

export type ToppingModel = {
  id: number;
  name: string;
  limit: number;
  maxLimit: number;
  type: string;
  sub_toppings: SubToppingModel[];
};

export type SubToppingModel = {
  id: number;
  name: string;
  price: number;
  toppingId: number;
};