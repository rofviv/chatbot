import { config } from "~/config";
import axios from "axios";

type Order = {
  id: string;
  store_name: string;
  status: string;
};

// {"id":198996,"name":"Económico Broasted","description":"Económico Broasted","price":20,"colors":null,"measure":null,"weight":null,"size":null,"photo":"https://i.ibb.co/vzF4dsC/eco-Broasted-pierna.png","status":"online","isOffer":0,"days":"0,1,2,3,4,5,6","merchantId":31970,"commissionPercentage":null,"pickupPercentage":null,"isPoint":0,"stock":null,"order":1,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":"2024-07-06T17:28:14.000Z","toppings":[{"id":58142,"name":"Cubiertos","order":1,"limit":1,"maxLimit":1,"type":"simple","productId":198996,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":null,"sub_toppings":[{"id":380321,"name":"Si","order":1,"price":1,"toppingId":58142,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":null},{"id":380323,"name":"No","order":1,"price":0,"toppingId":58142,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":null}]},{"id":58143,"name":"Elige Tus Salsas Favoritas","order":1,"limit":1,"maxLimit":3,"type":"multi","productId":198996,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null,"sub_toppings":[{"id":380325,"name":"Salsa De La Casa 50 Gr","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380326,"name":"Salsa De Ají 9 Gr","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380327,"name":"Salsa De Ajo 9 Gr","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380328,"name":"Frejol 100 Ml","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380330,"name":"Escabeche 50 Ml","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380332,"name":"Locoto 50 Ml","order":1,"price":0,"toppingId":58143,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null}]},{"id":58146,"name":"Seleccione Presa Económico Broasted","order":1,"limit":1,"maxLimit":1,"type":"multi","productId":198996,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null,"sub_toppings":[{"id":380334,"name":"Pierna Broasted","order":1,"price":0,"toppingId":58146,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380336,"name":"Contra Pierna Broasted","order":1,"price":0,"toppingId":58146,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null}]},{"id":58147,"name":"Seleccione Presa Extra Broasted","order":1,"limit":0,"maxLimit":4,"type":"multi","productId":198996,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null,"sub_toppings":[{"id":380339,"name":"Presa Extra Pierna 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380341,"name":"Presa Extra Contra Pierna 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380343,"name":"Presa Extra Pecho 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null},{"id":380344,"name":"Presa Extra Ala 1/8 Broasted","order":1,"price":9,"toppingId":58147,"createdAt":"2024-07-06T17:28:15.000Z","updatedAt":null}]}],"merchants_sub_categories":[{"id":134702,"name":"Pollo leña & broasted","merchantId":31970,"subCategoryId":906,"productId":198996,"order":1,"createdAt":"2024-07-06T17:28:14.000Z","updatedAt":"2024-07-06T17:28:14.000Z"}]}
export type Product = {
  id: number;
  name: string;
  // description: string;
  price: number;
  isOffer: number;
  // status: string;
  // days: string;
  toppings: Topping[];
  merchants_sub_categories: MerchantSubCategory[];
};

type MerchantSubCategory = {
  id: number;
  name: string;
  // merchantId: number;
  // subCategoryId: number;
  // productId: number;
};

type Topping = {
  id: number;
  name: string;
  limit: number;
  maxLimit: number;
  type: string;
  // productId: number;
  sub_toppings: SubTopping[];
};

type SubTopping = {
  id: number;
  name: string;
  price: number;
  toppingId: number;
};

// {"id":4553,"name":"Roy","lastname":null,"phone":"59177640286","email":"royvillarroel94@gmail.com","password":"$2b$10$9bSo4Y9O0gmgnwV0rFoDc.LVAczQSDk1FpbHQgvCseefDGnQBhnRq","rating":0,"status":"enabled","wallet":20,"last_login":"2024-03-13T16:11:21.000Z","app_version":null,"device":null,"referred_code":null,"birthday":null,"last_latitude":"0.00000000","last_longitude":"0.00000000","last_sync":null,"role":"customer","city_id":6,"createdAt":"2024-02-02T14:47:09.000Z","updatedAt":"2024-09-24T16:08:36.000Z","timezone_id":1,"order_capacity":0,"photo_url":null,"modality_id":null,"contract_url":null,"signature_url":null,"identity_number":null,"address":null,"extra_amount":0,"payment_option":0,"warranty_amount":0,"bearing":0,"jugno_id":null,"token_notification":null,"otp":965741,"referred_user_id":null,"merchant_id":null,"driver_validate":0,"top_motorcycle":0,"acceptance_rate":1,"type_bonus":0,"is_helper":0,"is_profile_complete":1,"nit":null,"business_name":null,"points":0,"country_code":null,"is_verified_phone":0,"is_verified_email":0,"addresses":[{"id":6,"name":"Adress Test","cityId":1,"address":"Address Test","latitude":-17.798797854405368,"longitude":-63.19796472787857,"coverageId":null,"references":"Address Test"}],"paymentMethods":null,"quantityOrdersActive":0,"notifications":0,"city":{"id":6,"name":"New York","currency":"USD"},"merchant":null}
type User = {
  id: number;
  name: string;
  phone: string;
  email: string;
  quantityOrdersActive: number;
  points: number;
  nit: string;
  business_name: string;
  status: string;
};

class PatioServiceApi {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getUser(phone: string): Promise<User> {
    try {
      const response = await axios.get(
        `${config.patioServiceUrl}/api/customer/profile-by-phone/${phone}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  async verifyExistsEmail(email: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${config.patioServiceUrl}/api/customer/verify-exists?email=${email}`
      );
      if (response.status === 200) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  async createUser(phone: string, name: string, email: string): Promise<User> {
    try {
      const response = await axios.post(
        `${config.patioServiceUrl}/api/customer`,
        { phone, name, email, password: "123456", isProfileComplete: 1 }
      );
      if (response.status === 200) {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error in createUser:", error);
      return null;
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
      const products = response.data.data.map((product: any): Product => ({
        id: product.id,
        name: product.name,
        // description: product.description,
        price: product.price,
        isOffer: product.isOffer,
        toppings: product.toppings.map((topping: any): Topping => ({
          id: topping.id,
          name: topping.name,
          limit: topping.limit,
          maxLimit: topping.maxLimit,
          type: topping.type,
          sub_toppings: topping.sub_toppings.map((subTopping: any): SubTopping => ({
            id: subTopping.id,
            name: subTopping.name,
            price: subTopping.price,
            toppingId: subTopping.toppingId,
          })),
        })),
        merchants_sub_categories: product.merchants_sub_categories.map(
          (category: any): MerchantSubCategory => ({
            id: category.id,
            name: category.name,
          })
        ),
      }));
      return products;
    } catch (error) {
      return [];
    }
  }

  async cancelOrder(orderId: number): Promise<boolean> {
    try {
      const response = await axios.put(
        `${config.patioServiceUrl}/api/orders/change-status/${orderId}?isOrder=1`,
        { status: "canceled", reason: "Canceled by chatbot" },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}

export default new PatioServiceApi(config.patioServiceToken);
