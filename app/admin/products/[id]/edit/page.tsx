import { AdminProductEditPage } from "@/src/main_pages/admin-product-edit-page";

type AdminProductEditRouteProps = {
    params: Promise<{ id: string }>;
};

export default async function AdminProductEditRoute({ params }: AdminProductEditRouteProps) {
    const { id } = await params;
    return <AdminProductEditPage productId={id} />;
}

