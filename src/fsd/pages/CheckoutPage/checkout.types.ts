export type CheckoutDeliveryMethod = "pickup" | "sdek";

export type CheckoutPaymentMethod = "on_receipt";

export type CheckoutFormState = {
    deliveryMethod: CheckoutDeliveryMethod;
    pickupAddressText: string;
    orderStoragePeriodText: string;
    paymentMethod: CheckoutPaymentMethod;
    orderComment: string;
    sdekAddressSelected: boolean;
};

export type CheckoutLine = {
    productId: string;
    title: string;
    imageSrc?: string;
    unitPrice: number;
    quantity: number;
    stockCount: number;
};
