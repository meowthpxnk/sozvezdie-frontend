import { ModeratorCatalogBrandEditPage } from "@/src/fsd/pages/ModerationCatalogEditPage";

type ModeratorCatalogBrandRouteProps = {
    params: Promise<{ sellerCardId: string }>;
};

export default async function ModeratorCatalogBrandRoute({
    params,
}: ModeratorCatalogBrandRouteProps) {
    const { sellerCardId } = await params;
    return <ModeratorCatalogBrandEditPage sellerCardId={sellerCardId} />;
}
