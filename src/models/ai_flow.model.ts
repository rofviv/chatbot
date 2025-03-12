export type AIResponse = {
  message: {
    body: string;
    media: string;
  };
  view_menu: boolean;
  is_finish: boolean;
  cancel_order: boolean;
};

export type AIResponseFinish = {
  products: ProductAIResponse[];
};

type ProductAIResponse = {
  quantity: number;
  productId: number;
  price: number;
  name: string;
  toppings: ToppingAIResponse[];
};

type ToppingAIResponse = {
  toppingId: number;
  toppingName: string;
  subToppingId: number;
  subToppingName: string;
  price: number;
};
