import { config } from "~/config";
import axios from "axios";
import { UserModel } from "~/models/user";
import { Order } from "~/models/order";
import {
  Product,
  MerchantSubCategory,
  Topping,
  SubTopping,
} from "~/models/product";
import { Merchant } from "~/models/merchat";

class PatioServiceApi {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getUser(phone: string): Promise<UserModel> {
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

  async createUser(
    phone: string,
    name: string,
    email: string
  ): Promise<UserModel> {
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
      const products = response.data.data.map(
        (product: any): Product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          isOffer: product.isOffer,
          toppings: product.toppings.map(
            (topping: any): Topping => ({
              id: topping.id,
              name: topping.name,
              limit: topping.limit,
              maxLimit: topping.maxLimit,
              type: topping.type,
              sub_toppings: topping.sub_toppings.map(
                (subTopping: any): SubTopping => ({
                  id: subTopping.id,
                  name: subTopping.name,
                  price: subTopping.price,
                  toppingId: subTopping.toppingId,
                })
              ),
            })
          ),
          merchants_sub_categories: product.merchants_sub_categories.map(
            (category: any): MerchantSubCategory => ({
              id: category.id,
              name: category.name,
            })
          ),
        })
      );
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

  async merchantsByClient(clientId: number): Promise<Merchant[]> {
    try {
      const response = await axios.get(
        `${config.patioServiceUrl}/api/merchants/client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return response.data.data.map(
        (merchant: any): Merchant => ({
          id: merchant.id,
          name: merchant.name,
          latitude: merchant.latitude,
          longitude: merchant.longitude,
          max_distance: merchant.max_distance,
          paymentCash: merchant.paymentCash,
          paymentQr: merchant.paymentQr,
        })
      );
    } catch (error) {
      return [];
    }
  }
}

export default new PatioServiceApi(config.patioServiceToken);
