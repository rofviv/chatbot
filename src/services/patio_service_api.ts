import { config } from "~/config"

type Order = {
    id: string
    status: string
}

class PatioServiceApi {
    private token: string

    constructor(token: string) {
        this.token = token
    }

    async getUser(phone: string): Promise<boolean> {
        try {
            // const response = await axios.get(`${config.patioServiceUrl}/users/${phone}`)
            // return response.data
            return false
        } catch (error) {
            console.error('Error in getUser:', error)
            throw error
        }
    }

    async createUser(phone: string, name: string, email: string): Promise<void> {
        try {
            // const response = await axios.post(`${config.patioServiceUrl}/users`, { phone })
            // return response.data
            return null
        } catch (error) {
            console.error('Error in createUser:', error)
            throw error
        }
    }

    async getOrder(orderId: string): Promise<Order> {
        try {
            // const response = await axios.get(`${config.patioServiceUrl}/orders/${orderId}`)
            // return response.data
            return {
                id: orderId,
                status: "pending"
            }
        } catch (error) {
            console.error('Error in getOrder:', error)
            throw error
        }
    }
}

export default new PatioServiceApi(config.patioServiceToken);