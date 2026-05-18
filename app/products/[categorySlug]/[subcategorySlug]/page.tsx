import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsPage } from "@pages";

type SubcategoryProductsRouteProps = {
    params: Promise<{
        categorySlug: string;
        subcategorySlug: string;
    }>;
};

export async function generateMetadata({
    params,
}: SubcategoryProductsRouteProps): Promise<Metadata> {
    const { subcategorySlug } = await params;
    return {
        title: subcategorySlug,
    };
}

export default async function SubcategoryProductsRoute({
    params,
}: SubcategoryProductsRouteProps) {
    const { categorySlug, subcategorySlug } = await params;
    return (
        <Suspense fallback={null}>
            <ProductsPage
                categorySlug={categorySlug}
                subcategorySlug={subcategorySlug}
            />
        </Suspense>
    );
}
