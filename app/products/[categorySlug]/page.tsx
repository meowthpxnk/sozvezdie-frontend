import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsPage } from "@pages";

type CategoryProductsRouteProps = {
    params: Promise<{ categorySlug: string }>;
};

export async function generateMetadata({
    params,
}: CategoryProductsRouteProps): Promise<Metadata> {
    const { categorySlug } = await params;
    return {
        title: categorySlug,
    };
}

export default async function CategoryProductsRoute({
    params,
}: CategoryProductsRouteProps) {
    const { categorySlug } = await params;
    return (
        <Suspense fallback={null}>
            <ProductsPage categorySlug={categorySlug} />
        </Suspense>
    );
}
