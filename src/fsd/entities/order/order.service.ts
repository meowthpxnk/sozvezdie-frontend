import { axiosWithAuth } from "@shared/api/interceptors";

import {
    BackendOrderStatus,
    IOrderCreateRequest,
    IOrdersListResponse,
    IUserOrderResponse,
    OrderLineItem,
    OrderStatusKey,
    UserOrder,
} from "./order.types";

const mapBackendStatus = (status: BackendOrderStatus): OrderStatusKey => {
    switch (status) {
        case "PENDING":
        case "PAID":
            return "awaiting_delivery";
        case "SHIPPED":
            return "in_transit";
        case "DELIVERED":
            return "delivered";
        case "CANCELED":
            return "cancelled";
        default:
            return "awaiting_delivery";
    }
};

const mapLineItem = (item: IUserOrderResponse["items"][number]): OrderLineItem => ({
    productId: String(item.product_id),
    name: item.name,
    priceAtTime: item.price_at_time,
    lineTotal: item.line_total,
    image: item.image,
    quantity: item.quantity,
});

const mapOrder = (order: IUserOrderResponse): UserOrder => ({
    id: String(order.id),
    statusKey: mapBackendStatus(order.status),
    paymentMethod: order.payment_method,
    deliveryMethod: order.delivery_method,
    itemsTotal: order.items_total,
    deliveryCost: order.delivery_cost,
    total: order.total,
    createdAt: order.created_at,
    products: order.items.map(mapLineItem),
});

class OrderService {
    private BASE_URL = "/order";

    async getOrders(archive = false): Promise<UserOrder[]> {
        const response = await axiosWithAuth.get<IOrdersListResponse>(
            `${this.BASE_URL}`,
            { params: { archive } }
        );
        return response.data.items.map(mapOrder);
    }

    async createOrder(data: IOrderCreateRequest): Promise<UserOrder> {
        const response = await axiosWithAuth.post<IUserOrderResponse>(
            `${this.BASE_URL}`,
            data
        );
        return mapOrder(response.data);
    }
}

const orderService = new OrderService();
export default orderService;
