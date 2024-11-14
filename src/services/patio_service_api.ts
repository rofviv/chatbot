import { config } from "~/config";
import axios from "axios";

type Order = {
  id: string;
  store_name: string;
  status: string;
};

// {"id":198996,"name":"Económico Broasted","description":"Económico Broasted","price":20,"colors":null,"measure":null,"weight":null,"size":null,"photo":"https://i.ibb.co/vzF4dsC/eco-Broasted-pierna.png","status":"online","isOffer":0,"days":"0,1,2,3,4,5,6","merchantId":31970,"commissionPercentage":null,"pickupPercentage":null,"isPoint":0,"stock":null,"order":1,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":"2024-07-06T17:28:14.000Z","toppings":[{"id":58142,"name":"Cubiertos","order":1,"limit":1,"maxLimit":1,"type":"simple","productId":198996,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":null,"sub_toppings":[{"id":380321,"name":"Si","order":1,"price":1,"toppingId":58142,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":null},{"id":380323,"name":"No","order":1,"price":0,"toppingId":58142,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":null}]},{"id":58143,"name":"Elige Tus Salsas Favoritas","order":1,"limit":1,"maxLimit":3,"type":"multi","productId":198996,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null,"sub_toppings":[{"id":380325,"name":"Salsa De La Casa 50 Gr","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380326,"name":"Salsa De Ají 9 Gr","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380327,"name":"Salsa De Ajo 9 Gr","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380328,"name":"Frejol 100 Ml","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380330,"name":"Escabeche 50 Ml","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380332,"name":"Locoto 50 Ml","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null}]},{"id":58146,"name":"Seleccione Presa Económico Broasted","order":1,"limit":1,"maxLimit":1,"type":"multi","productId":198996,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null,"sub_toppings":[{"id":380334,"name":"Pierna Broasted","order":1,"price":0,"toppingId":58146,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380336,"name":"Contra Pierna Broasted","order":1,"price":0,"toppingId":58146,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null}]},{"id":58147,"name":"Seleccione Presa Extra Broasted","order":1,"limit":0,"maxLimit":4,"type":"multi","productId":198996,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null,"sub_toppings":[{"id":380339,"name":"Presa Extra Pierna 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380341,"name":"Presa Extra Contra Pierna 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380343,"name":"Presa Extra Pecho 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380344,"name":"Presa Extra Ala 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null}]}],"merchants_sub_categories":[{"id":134702,"name":"Pollo leña & broasted","merchantId":31970,"subCategoryId":906,"productId":198996,"order":1,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":"2024-07-06T17:28:14.000Z"}]}
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  isOffer: number;
  status: string;
  days: string;
  toppings: Topping[];
  merchants_sub_categories: MerchantSubCategory[];
};

type MerchantSubCategory = {
  id: number;
  name: string;
  merchantId: number;
  subCategoryId: number;
  productId: number;
};

type Topping = {
  id: number;
  name: string;
  limit: number;
  maxLimit: number;
  type: string;
  productId: number;
  sub_toppings: SubTopping[];
};

type SubTopping = {
  id: number;
  name: string;
  price: number;
  toppingId: number;
};

class PatioServiceApi {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getUser(phone: string): Promise<boolean> {
    try {
      // const response = await axios.get(`${config.patioServiceUrl}/users/${phone}`)
      // return response.data
      return false;
    } catch (error) {
      console.error("Error in getUser:", error);
      throw error;
    }
  }

  async createUser(phone: string, name: string, email: string): Promise<void> {
    try {
      // const response = await axios.post(`${config.patioServiceUrl}/users`, { phone })
      // return response.data
      return null;
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  }

  async getOrder(orderId: number): Promise<Order> {
    try {
      const response = await axios.get(
        `${config.patioServiceUrl}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getProducts(merchantId: number): Promise<Product[]> {
    try {
      const response = await axios.get(
        `${config.patioServiceUrl}/api/product/merchant/${merchantId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error in getProducts:", error);
      return [];
    }
  }
}

export default new PatioServiceApi(config.patioServiceToken);
