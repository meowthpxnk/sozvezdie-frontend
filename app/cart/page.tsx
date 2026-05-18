import { RootState, useAppSelector } from "@/src/fsd/shared/store/store";
import { CartPage } from "@pages";

export default function CartRoute() {
    // const cart = useAppSelector((state: RootState) => state.cart);
    // const cartItems = cart.cart;

    return <CartPage />;
}
