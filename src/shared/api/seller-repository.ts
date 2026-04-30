import { createDefaultSellerSnapshot } from "@/src/shared/api/seller-adapters";
import type {
    CreateSellerProductPayload,
    SellerSnapshot,
    UpdateSellerBrandPayload,
    UpdateSellerProductPayload,
} from "@/src/shared/types/seller";

export interface SellerRepository {
    getSnapshot(): Promise<SellerSnapshot>;
    createProduct(payload: CreateSellerProductPayload): Promise<SellerSnapshot>;
    updateProduct(payload: UpdateSellerProductPayload): Promise<SellerSnapshot>;
    deleteProduct(id: string): Promise<SellerSnapshot>;
    updateBrand(payload: UpdateSellerBrandPayload): Promise<SellerSnapshot>;
}

const STORAGE_KEY = "seller-admin-snapshot-v1";

const nowIso = () => new Date().toISOString();

const readSnapshot = (): SellerSnapshot => {
    if (typeof window === "undefined") {
        return createDefaultSellerSnapshot();
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            const initial = createDefaultSellerSnapshot();
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(raw) as SellerSnapshot;
    } catch {
        return createDefaultSellerSnapshot();
    }
};

export const getInitialSellerSnapshot = (): SellerSnapshot => readSnapshot();

const saveSnapshot = (snapshot: SellerSnapshot): SellerSnapshot => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    }
    return snapshot;
};

class LocalSellerRepository implements SellerRepository {
    async getSnapshot(): Promise<SellerSnapshot> {
        return readSnapshot();
    }

    async createProduct(payload: CreateSellerProductPayload): Promise<SellerSnapshot> {
        const snapshot = readSnapshot();
        const productId = `product-${Date.now()}`;
        const nextProduct = {
            id: productId,
            sellerId: snapshot.sellerId,
            brandId: snapshot.brand.id,
            ...payload,
            stockCount: 0,
            moderationStatus: "pending" as const,
            moderationComment: "",
            updatedAt: nowIso(),
        };
        return saveSnapshot({ ...snapshot, products: [nextProduct, ...snapshot.products] });
    }

    async updateProduct(payload: UpdateSellerProductPayload): Promise<SellerSnapshot> {
        const snapshot = readSnapshot();
        const nextProducts = snapshot.products.map((product) =>
            product.id === payload.id
                ? {
                    ...product,
                    ...payload,
                    moderationStatus: "pending",
                    moderationComment: "",
                    updatedAt: nowIso(),
                }
                : product
        );
        return saveSnapshot({ ...snapshot, products: nextProducts });
    }

    async deleteProduct(id: string): Promise<SellerSnapshot> {
        const snapshot = readSnapshot();
        const nextProducts = snapshot.products.filter((product) => product.id !== id);
        return saveSnapshot({ ...snapshot, products: nextProducts });
    }

    async updateBrand(payload: UpdateSellerBrandPayload): Promise<SellerSnapshot> {
        const snapshot = readSnapshot();
        return saveSnapshot({
            ...snapshot,
            brand: {
                ...snapshot.brand,
                ...payload,
                updatedAt: nowIso(),
            },
        });
    }
}

let repository: SellerRepository | null = null;

export const getSellerRepository = (): SellerRepository => {
    if (!repository) {
        repository = new LocalSellerRepository();
    }
    return repository;
};

