import { ModeratorCatalogProductEditPage } from "@/src/fsd/pages/ModerationCatalogEditPage";

type ModeratorCatalogProductRouteProps = {
    params: Promise<{ productId: string }>;
};

export default async function ModeratorCatalogProductRoute({
    params,
}: ModeratorCatalogProductRouteProps) {
    const { productId } = await params;
    return <ModeratorCatalogProductEditPage productId={productId} />;
}
