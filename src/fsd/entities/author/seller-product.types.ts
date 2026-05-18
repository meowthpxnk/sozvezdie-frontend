import type { Product } from "../product";

export type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ISellerProductApiResponse {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    authorId: string;
    stockCount: number;
    moderationStatus: ModerationStatus;
    createdAt: string;
    moderatorComment?: string | null;
    categorySlug?: string | null;
    subcategorySlug?: string | null;
    fandomSlug?: string | null;
}

export interface SellerProduct extends Product {
    moderationStatus: ModerationStatus;
    createdAt: string;
    moderatorComment?: string;
}

export const MODERATION_STATUS_LABELS: Record<ModerationStatus, string> = {
    PENDING: "На модерации",
    APPROVED: "Одобрен",
    REJECTED: "Отклонён",
};

export const MODERATION_STATUS_BADGE: Record<
    ModerationStatus,
    { background: string; color: string }
> = {
    PENDING: { background: "#fff4e5", color: "#8a5a12" },
    APPROVED: { background: "#e3efd6", color: "#38593a" },
    REJECTED: { background: "#fde6e9", color: "#863838" },
};

export function mapSellerProduct(data: ISellerProductApiResponse): SellerProduct {
    return {
        id: data.id,
        name: data.name,
        price: data.price,
        description: data.description,
        images: data.images,
        mainImage: data.images[0] ?? "",
        authorId: data.authorId,
        stockCount: data.stockCount,
        categorySlug: data.categorySlug,
        subcategorySlug: data.subcategorySlug,
        fandomSlug: data.fandomSlug,
        moderationStatus: data.moderationStatus,
        createdAt: data.createdAt,
        moderatorComment: data.moderatorComment ?? undefined,
    };
}
