import { AUTHORS, PRODUCTS_LIST, type AuthorMock, type ProductMock } from "@/src/shared/mocks/products";
import type {
    SellerBrand,
    SellerProduct,
    SellerProductImage,
    SellerSnapshot,
} from "@/src/shared/types/seller";

export const DEFAULT_SELLER_ID = "kere";
export const DEFAULT_BRAND_ID = "brand-kere";
const KERE_BRAND_NAME = "KERE";

const parsePrice = (priceText: string): number => {
    const digits = priceText.replace(/[^\d]/g, "");
    return Number(digits) || 0;
};

const buildImages = (product: ProductMock): SellerProductImage[] => {
    const source = product.images?.length ? product.images : product.imageSrc ? [product.imageSrc] : [];
    return source.map((url, index) => ({
        id: `${product.id}-image-${index}`,
        url,
    }));
};

const toSellerProduct = (product: ProductMock): SellerProduct => {
    const images = buildImages(product);
    return {
        id: product.id,
        sellerId: DEFAULT_SELLER_ID,
        brandId: DEFAULT_BRAND_ID,
        name: product.nameText,
        description: `Описание товара ${product.nameText}.`,
        price: parsePrice(product.priceText),
        stockCount: product.stockCount,
        images,
        coverImageId: images[0]?.id ?? "",
        moderationStatus: "approved",
        updatedAt: new Date().toISOString(),
    };
};

const getKereAuthor = (): AuthorMock | undefined => AUTHORS.find((author) => author.name === KERE_BRAND_NAME);

export const createDefaultSellerBrand = (): SellerBrand => {
    const kereAuthor = getKereAuthor();
    return {
        id: DEFAULT_BRAND_ID,
        sellerId: DEFAULT_SELLER_ID,
        brandName: kereAuthor?.name ?? KERE_BRAND_NAME,
        brandDescription: kereAuthor?.description ?? "",
        avatar: kereAuthor?.avatarImageSrc ?? "",
        banner: kereAuthor?.bannerImageSrc ?? "",
        updatedAt: new Date().toISOString(),
    };
};

export const createDefaultSellerSnapshot = (): SellerSnapshot => {
    const products = PRODUCTS_LIST.filter((product) => product.brandText === KERE_BRAND_NAME).map(toSellerProduct);
    return {
        sellerId: DEFAULT_SELLER_ID,
        brand: createDefaultSellerBrand(),
        products,
    };
};

