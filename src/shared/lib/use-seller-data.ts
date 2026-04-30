"use client";

import { useCallback, useMemo, useState } from "react";
import { getInitialSellerSnapshot, getSellerRepository } from "@/src/shared/api/seller-repository";
import { AUTHORS, PRODUCTS_LIST } from "@/src/shared/mocks/products";
import type { AuthorMock, ProductMock } from "@/src/shared/mocks/products";
import type {
    CreateSellerProductPayload,
    SellerSnapshot,
    UpdateSellerBrandPayload,
    UpdateSellerProductPayload,
} from "@/src/shared/types/seller";

type UseSellerDataResult = {
    snapshot: SellerSnapshot | null;
    isLoading: boolean;
    refresh: () => Promise<void>;
    createProduct: (payload: CreateSellerProductPayload) => Promise<void>;
    updateProduct: (payload: UpdateSellerProductPayload) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    updateBrand: (payload: UpdateSellerBrandPayload) => Promise<void>;
    storefrontProducts: ProductMock[];
    storefrontAuthors: AuthorMock[];
};

const asPriceText = (price: number): string => `${Math.max(0, Math.round(price))} ₽`;

const getCoverImage = (product: SellerSnapshot["products"][number]): string | undefined => {
    return product.images.find((image) => image.id === product.coverImageId)?.url ?? product.images[0]?.url;
};

const toStorefrontProduct = (product: SellerSnapshot["products"][number], brandName: string): ProductMock => ({
    id: product.id,
    imageSrc: getCoverImage(product),
    imageAlt: product.name,
    images: product.images.map((image) => image.url),
    priceText: asPriceText(product.price),
    stockCount: product.stockCount,
    nameText: product.name,
    brandText: brandName,
});

export const useSellerData = (): UseSellerDataResult => {
    const [snapshot, setSnapshot] = useState<SellerSnapshot | null>(() => getInitialSellerSnapshot());
    const [isLoading] = useState(false);
    const repository = getSellerRepository();

    const refresh = useCallback(async () => {
        const nextSnapshot = await repository.getSnapshot();
        setSnapshot(nextSnapshot);
    }, [repository]);

    const createProduct = useCallback(async (payload: CreateSellerProductPayload) => {
        const nextSnapshot = await repository.createProduct(payload);
        setSnapshot(nextSnapshot);
    }, [repository]);

    const updateProduct = useCallback(async (payload: UpdateSellerProductPayload) => {
        const nextSnapshot = await repository.updateProduct(payload);
        setSnapshot(nextSnapshot);
    }, [repository]);

    const deleteProduct = useCallback(async (id: string) => {
        const nextSnapshot = await repository.deleteProduct(id);
        setSnapshot(nextSnapshot);
    }, [repository]);

    const updateBrand = useCallback(async (payload: UpdateSellerBrandPayload) => {
        const nextSnapshot = await repository.updateBrand(payload);
        setSnapshot(nextSnapshot);
    }, [repository]);

    const storefrontAuthors = useMemo(() => {
        if (!snapshot) {
            return AUTHORS;
        }
        return AUTHORS.map((author) =>
            author.name === "KERE"
                ? {
                    ...author,
                    name: snapshot.brand.brandName,
                    avatarImageSrc: snapshot.brand.avatar,
                    bannerImageSrc: snapshot.brand.banner,
                    description: snapshot.brand.brandDescription,
                }
                : author
        );
    }, [snapshot]);

    const storefrontProducts = useMemo(() => {
        if (!snapshot) {
            return PRODUCTS_LIST;
        }

        const nonKereProducts = PRODUCTS_LIST.filter((item) => item.brandText !== "KERE");
        const sellerProducts = snapshot.products.map((product) => toStorefrontProduct(product, snapshot.brand.brandName));
        return [...sellerProducts, ...nonKereProducts];
    }, [snapshot]);

    return {
        snapshot,
        isLoading,
        refresh,
        createProduct,
        updateProduct,
        deleteProduct,
        updateBrand,
        storefrontProducts,
        storefrontAuthors,
    };
};

