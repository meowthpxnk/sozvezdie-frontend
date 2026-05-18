import { AuthorProductEditPage } from "@/src/fsd/pages/AuthorProductEditPage";

type AdminProductEditRouteProps = {
    params: Promise<{ id: string }>;
};

export default async function AdminProductEditRoute({ params }: AdminProductEditRouteProps) {
    const { id } = await params;
    return <AuthorProductEditPage productId={id} />;
}
