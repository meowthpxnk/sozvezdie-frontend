import { Suspense } from "react";
import { CartPage } from "@pages";

export default function CartRoute() {
    return (
        <Suspense fallback={null}>
            <CartPage />
        </Suspense>
    );
}
