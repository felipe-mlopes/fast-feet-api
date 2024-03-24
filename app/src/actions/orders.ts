import { getSession } from "./auth"

export interface OrdersProps {
    id: string
    trackingCode?: string
    title: string
    recipientId?: string
    status: string
    isReturn?: boolean
    city?: string
    neighborhood?: string
    deliverymanId?: string
    createdAt: string
    picknUpAt?: string | null
    deliveryAt?: string | null
}

export interface RecipientProps {
    id: string
    name: string
    email: string
    zipcode: number
    address: string
}

export async function getOrdersPending(city: string) {
    const { token } = await getSession()

    const response = await fetch(`http://localhost:3333/orders/pending?city=${city}`, {
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

    const response = await fetch(`http://localhost:3333/orders/done?city=${city}`, {
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

    const response = await fetch(`http://localhost:3333/orders/${orderId}`, {
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