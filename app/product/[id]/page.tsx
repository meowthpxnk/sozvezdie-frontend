// import { ProductPage } from "@/src/main_pages/product-page";
import { SingleProductPage } from "@pages";

type ProductRouteProps = {
    params: Promise<{ id: string }>;
};

export default async function ProductRoute({ params }: ProductRouteProps) {
    const { id } = await params;

    // return <ProductPage productId={id} />;
    return <SingleProductPage id={id} />;
}
