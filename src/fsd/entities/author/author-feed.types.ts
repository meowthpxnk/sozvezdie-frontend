import { priceFormatter } from "@shared/formatters";

import type { ModerationStatus, SellerProduct } from "./seller-product.types";

export type AuthorFeedFilter = ModerationStatus | "ALL";

export type AuthorFeedOperationType =
    | "CREATE_PRODUCT"
    | "CREATE_SHOP"
    | "UPDATE_BRAND";

export type AuthorFeedItem = {
    id: string;
    createdAt: string;
    title: string;
    operationType: AuthorFeedOperationType;
    status: ModerationStatus;
    details: string[];
    moderatorComment?: string;
};

export const AUTHOR_FEED_OPERATION_LABELS: Record<AuthorFeedOperationType, string> = {
    CREATE_PRODUCT: "Новый товар",
    CREATE_SHOP: "Создание магазина",
    UPDATE_BRAND: "Изменение бренда",
};

export function mapProductToFeedItem(product: SellerProduct): AuthorFeedItem {
    const details = [`Цена: ${priceFormatter(product.price)}`, `В наличии: ${product.stockCount} шт.`];

    if (product.categorySlug) {
        details.push(`Категория: ${product.categorySlug}`);
    }

    if (product.fandomSlug) {
        details.push(`Фандом: ${product.fandomSlug}`);
    }

    return {
        id: `product-${product.id}`,
        createdAt: product.createdAt,
        title: product.name,
        operationType: "CREATE_PRODUCT",
        status: product.moderationStatus,
        details,
        moderatorComment: product.moderatorComment ?? undefined,
    };
}

export function mapBrandModerationToFeedItem(data: {
    id: string;
    createdAt: string;
    actionType: string;
    status: ModerationStatus;
    title: string;
    details: string[];
    moderatorComment?: string | null;
}): AuthorFeedItem {
    const operationType =
        data.actionType === "UPDATE_BRAND"
            ? "UPDATE_BRAND"
            : data.actionType === "CREATE_SHOP"
              ? "CREATE_SHOP"
              : "CREATE_SHOP";

    return {
        id: `brand-${data.id}`,
        createdAt: data.createdAt,
        title: data.title,
        operationType,
        status: data.status,
        details: data.details,
        moderatorComment: data.moderatorComment ?? undefined,
    };
}
