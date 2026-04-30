"use client";

import { useEffect, useSyncExternalStore } from "react";

type CartQuantities = Record<string, number>;

type CatalogState = {
    likedIds: string[];
    likedAuthorIds: string[];
    cartQuantities: CartQuantities;
};

const STORAGE_KEY = "catalog-state-v1";

let memoryState: CatalogState | null = null;
let isClientStorageHydrated = false;
const listeners = new Set<() => void>();

const sanitizeCartQuantities = (value: unknown): CartQuantities => {
    if (!value || typeof value !== "object") {
        return {};
    }

    const parsed = Object.entries(value as Record<string, unknown>).reduce<CartQuantities>((acc, [productId, amount]) => {
        if (typeof amount !== "number") {
            return acc;
        }

        if (amount > 0) {
            acc[productId] = Math.floor(amount);
        }

        return acc;
    }, {});

    return parsed;
};

const sanitizeState = (raw: unknown, defaultLikedIds: string[]): CatalogState => {
    if (!raw || typeof raw !== "object") {
        return {
            likedIds: [...defaultLikedIds],
            likedAuthorIds: [],
            cartQuantities: {},
        };
    }

    const candidate = raw as Partial<CatalogState>;
    const likedIds = Array.isArray(candidate.likedIds) ? candidate.likedIds.filter((id): id is string => typeof id === "string") : [];
    const likedAuthorIds = Array.isArray(candidate.likedAuthorIds)
        ? candidate.likedAuthorIds.filter((id): id is string => typeof id === "string")
        : [];
    const cartQuantities = sanitizeCartQuantities(candidate.cartQuantities);

    return {
        likedIds,
        likedAuthorIds,
        cartQuantities,
    };
};

const readFromLocalStorage = (defaultLikedIds: string[]): CatalogState => {
    if (typeof window === "undefined") {
        return {
            likedIds: [...defaultLikedIds],
            likedAuthorIds: [],
            cartQuantities: {},
        };
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return {
            likedIds: [...defaultLikedIds],
            likedAuthorIds: [],
            cartQuantities: {},
        };
    }

    try {
        const parsed = JSON.parse(raw);
        return sanitizeState(parsed, defaultLikedIds);
    } catch {
        return {
            likedIds: [...defaultLikedIds],
            likedAuthorIds: [],
            cartQuantities: {},
        };
    }
};

/** Текущие id лайкнутых товаров из persisted storage (тот же ключ и правила, что у каталога). */
export function readPersistedLikedIds(defaultLikedIds: string[]): string[] {
    return readFromLocalStorage(defaultLikedIds).likedIds;
}

const getSnapshot = (defaultLikedIds: string[]): CatalogState => {
    if (!memoryState) {
        memoryState = {
            likedIds: [...defaultLikedIds],
            likedAuthorIds: [],
            cartQuantities: {},
        };
    }

    return memoryState;
};

const emit = () => {
    listeners.forEach((listener) => listener());
};

const persistState = (state: CatalogState) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
};

const updateState = (updater: (prev: CatalogState) => CatalogState, defaultLikedIds: string[]) => {
    const prevState = getSnapshot(defaultLikedIds);
    memoryState = updater(prevState);
    persistState(memoryState);
    emit();
};

const subscribe = (listener: () => void, defaultLikedIds: string[]) => {
    listeners.add(listener);

    if (typeof window === "undefined") {
        return () => {
            listeners.delete(listener);
        };
    }

    const onStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY) {
            return;
        }

        memoryState = readFromLocalStorage(defaultLikedIds);
        emit();
    };

    window.addEventListener("storage", onStorage);

    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
};

export const useCatalogStorage = (defaultLikedIds: string[] = []) => {
    const subscribeWithDefaults = (listener: () => void) => subscribe(listener, defaultLikedIds);

    const state = useSyncExternalStore(
        subscribeWithDefaults,
        () => getSnapshot(defaultLikedIds),
        () => ({
            likedIds: [...defaultLikedIds],
            likedAuthorIds: [],
            cartQuantities: {},
        }),
    ) as CatalogState;

    useEffect(() => {
        if (isClientStorageHydrated) {
            return;
        }

        memoryState = readFromLocalStorage(defaultLikedIds);
        isClientStorageHydrated = true;
        emit();
    }, [defaultLikedIds]);

    const toggleLike = (productId: string) => {
        updateState((prev) => {
            const nextLiked = prev.likedIds.includes(productId)
                ? prev.likedIds.filter((id) => id !== productId)
                : [...prev.likedIds, productId];

            return {
                ...prev,
                likedIds: nextLiked,
            };
        }, defaultLikedIds);
    };

    const setCartQuantity = (productId: string, quantity: number) => {
        updateState((prev) => {
            const nextQuantities = { ...prev.cartQuantities };
            const normalized = Math.max(0, Math.floor(quantity));

            if (normalized === 0) {
                delete nextQuantities[productId];
            } else {
                nextQuantities[productId] = normalized;
            }

            return {
                ...prev,
                cartQuantities: nextQuantities,
            };
        }, defaultLikedIds);
    };

    const toggleAuthorLike = (authorId: string) => {
        updateState((prev) => {
            const nextLikedAuthors = prev.likedAuthorIds.includes(authorId)
                ? prev.likedAuthorIds.filter((id) => id !== authorId)
                : [...prev.likedAuthorIds, authorId];

            return {
                ...prev,
                likedAuthorIds: nextLikedAuthors,
            };
        }, defaultLikedIds);
    };

    return {
        likedIds: state.likedIds,
        likedAuthorIds: state.likedAuthorIds,
        cartQuantities: state.cartQuantities,
        isLiked: (productId: string) => state.likedIds.includes(productId),
        isAuthorLiked: (authorId: string) => state.likedAuthorIds.includes(authorId),
        getCartQuantity: (productId: string) => state.cartQuantities[productId] ?? 0,
        toggleLike,
        toggleAuthorLike,
        setCartQuantity,
    };
};
