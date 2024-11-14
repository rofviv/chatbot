import { config } from "~/config";
import axios from "axios";

type Order = {
  id: string;
  store_name: string;
  status: string;
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
}

export default new PatioServiceApi(config.patioServiceToken);
