export type OrderStatusKey =
    | "cancelled"
    | "delivered"
    | "received"
    | "awaiting_delivery"
    | "in_transit";

export type BackendOrderStatus =
    | "PENDING"
    | "PAID"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED";

export type BackendPaymentMethod = "CARD_ONLINE" | "ON_RECEIPT";

export type BackendDeliveryMethod = "COURIER" | "PICKUP_POINT" | "POST";

export const ORDER_STATUS_LABELS: Record<OrderStatusKey, string> = {
    cancelled: "Отменён",
    delivered: "Доставлен",
    received: "Получен",
    awaiting_delivery: "Ожидает доставки",
    in_transit: "В пути",
};

export const PAYMENT_METHOD_LABELS: Record<BackendPaymentMethod, string> = {
    CARD_ONLINE: "Карта онлайн",
    ON_RECEIPT: "При получении",
};

export const DELIVERY_METHOD_LABELS: Record<BackendDeliveryMethod, string> = {
    COURIER: "Курьер",
    PICKUP_POINT: "Пункт выдачи",
    POST: "Почта России",
};

export interface OrderLineItem {
    productId: string;
    name: string;
    priceAtTime: number;
    lineTotal: number;
    image: string | null;
    quantity: number;
}

export interface UserOrder {
    id: string;
    statusKey: OrderStatusKey;
    paymentMethod: BackendPaymentMethod;
    deliveryMethod: BackendDeliveryMethod;
    itemsTotal: number;
    deliveryCost: number;
    total: number;
    createdAt: string;
    products: OrderLineItem[];
}

export interface IOrderLineItemResponse {
    product_id: number;
    name: string;
    price_at_time: number;
    line_total: number;
    image: string | null;
    quantity: number;
}

export interface IUserOrderResponse {
    id: number;
    status: BackendOrderStatus;
    payment_method: BackendPaymentMethod;
    delivery_method: BackendDeliveryMethod;
    items_total: number;
    delivery_cost: number;
    total: number;
    created_at: string;
    items: IOrderLineItemResponse[];
}

export interface IOrdersListResponse {
    items: IUserOrderResponse[];
}

export interface IOrderCreateItemRequest {
    product_id: number;
    quantity: number;
}

export interface IOrderCreateRequest {
    payment_method: BackendPaymentMethod;
    delivery_method: BackendDeliveryMethod;
    delivery_cost?: number;
    items: IOrderCreateItemRequest[];
}
