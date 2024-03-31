import { api } from "../api"
import { getSession } from "./auth"

export async function getOrdersPending(city: string) {
    const { token } = await getSession()

    const response = await api(`/orders/pending?city=${city}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await response.json()

    return {
        ordersPending: data.orders
    }
}

export async function getOrdersDone(city: string) {
    const { token } = await getSession()

    const response = await api(`/orders/done?city=${city}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await response.json()

    return {
        ordersDone: data.orders
    }
}

export async function getOrderByDetails(orderId: string) {
    const { token } = await getSession()

    const response = await api(`/orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await response.json()

    return {
        order: data.order,
        recipient: data.recipient
    }
}