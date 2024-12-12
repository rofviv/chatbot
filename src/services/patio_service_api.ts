import { config } from "~/config";
import axios from "axios";
import { AddressUserModel, UserModel } from "~/models/user.model";
import { OrderModel } from "~/models/order.model";
import {
  ProductModel,
  MerchantSubCategoryModel,
  ToppingModel,
  SubToppingModel,
} from "~/models/product.model";
import { MerchantModel } from "~/models/merchant.model";
import { CoverageModel } from "~/models/coverage.model";
import { CreateAddressDto } from "~/dtos/create_address.dto";
import { QuoteDto } from "~/dtos/quote.dto";
import { QuoteModel } from "~/models/quote.model";
import { CreateOrderDto } from "~/dtos/create_order.dto";
import { HealthCheckResponse } from "~/dtos/response_status";

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

  async getOrder(orderId: number): Promise<OrderModel> {
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

  async getProducts(merchantId: number): Promise<ProductModel[]> {
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
        (product: any): ProductModel => ({
          id: product.id,
          name: product.name,
          photo: product.photo,
          price: product.price,
          isOffer: product.isOffer,
          toppings: product.toppings.map(
            (topping: any): ToppingModel => ({
              id: topping.id,
              name: topping.name,
              limit: topping.limit,
              maxLimit: topping.maxLimit,
              type: topping.type,
              sub_toppings: topping.sub_toppings.map(
                (subTopping: any): SubToppingModel => ({
                  id: subTopping.id,
                  name: subTopping.name,
                  price: subTopping.price,
                  toppingId: subTopping.toppingId,
                })
              ),
            })
          ),
          merchants_sub_categories: product.merchants_sub_categories.map(
            (category: any): MerchantSubCategoryModel => ({
              id: category.id,
              name: category.name,
              order: category.order,
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

  async merchantsByClient(clientId: number): Promise<MerchantModel[]> {
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
        (merchant: any): MerchantModel => ({
          id: merchant.id,
          name: merchant.name,
          latitude: merchant.latitude,
          longitude: merchant.longitude,
          max_distance: merchant.max_distance,
          paymentCash: merchant.paymentCash,
          paymentQr: merchant.paymentQr,
          address: merchant.address,
        })
      );
    } catch (error) {
      return [];
    }
  }

  async getCoverage(latitude: number, longitude: number): Promise<CoverageModel> {
    try {
      const response = await axios.post(
        `${config.patioServiceUrl}/api/coverages/coordinate`,
        { latitude, longitude, type: 0 },
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

  async saveAddress(address: CreateAddressDto): Promise<AddressUserModel> {
    try {
      const response = await axios.post(
        `${config.patioServiceUrl}/api/address`,
        address,
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

  async getQuote(order: QuoteDto): Promise<QuoteModel> {
    try {
      const response = await axios.post(
        `${config.patioServiceUrl}/api/orders/quote`,
        order,
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

  async createOrder(dto: CreateOrderDto): Promise<OrderModel | string>  {
    try {
      const response = await axios.post(
        `${config.patioServiceUrl}/api/orders`,
        dto,
        {
        headers: {
          Authorization: `Bearer ${this.token}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data.data;
      } else {
        return (response as any).message as string;
      }
    } catch (error) {
      return error;
    }
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const response = await axios.get(
        `${config.patioServiceUrl}/api/payment`,
        {
        headers: {
          Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return {
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error in health check",
      };
    }
  }
}

export default new PatioServiceApi(config.patioServiceToken);
