import type {
    BackendDeliveryMethod,
    BackendPaymentMethod,
    IOrderCreateRequest,
} from "../../entities/order";

import type { CheckoutDeliveryMethod, CheckoutFormState } from "./checkout.types";

export type CheckoutLinePayload = {
    productId: string;
    quantity: number;
};

const PAYMENT_METHOD_MAP: Record<
    CheckoutFormState["paymentMethod"],
    BackendPaymentMethod
> = {
    on_receipt: "ON_RECEIPT",
};

const DELIVERY_METHOD_MAP: Record<
    CheckoutDeliveryMethod,
    BackendDeliveryMethod
> = {
    pickup: "PICKUP_POINT",
    sdek: "POST",
};

export function mapCheckoutToOrderRequest(
    form: CheckoutFormState,
    lines: CheckoutLinePayload[],
    deliveryCost: number
): IOrderCreateRequest {
    return {
        payment_method: PAYMENT_METHOD_MAP[form.paymentMethod],
        delivery_method: DELIVERY_METHOD_MAP[form.deliveryMethod],
        delivery_cost: deliveryCost,
        items: lines.map((line) => ({
            product_id: Number(line.productId),
            quantity: line.quantity,
        })),
    };
}
