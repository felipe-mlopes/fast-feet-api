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
