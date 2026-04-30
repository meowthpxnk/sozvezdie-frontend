"use client";

import styled from "styled-components";
import { Heart } from "lucide-react";
import { useSellerData } from "@/src/shared/lib/use-seller-data";
import { IconActionButton } from "@/src/shared/ui/icon-action-button";
import type { MouseEvent } from "react";
import { useCatalogStorage } from "@/src/shared/lib/catalog-storage";
import { useRouter } from "next/navigation";

const ProductCardWrapper = styled.article`
    background-color: #fff;
    border-radius: 14px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: pointer;
    color: inherit;
    text-decoration: none;
`;


const ProductImageContainerWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;

  width: 100%;
  aspect-ratio: 1 / 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  img[src="none"] {
    visibility: hidden;
  }
`;

const ProductPriceAndActionsRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
`;

const ProductActionButtons = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ProductActionButton = styled(IconActionButton)``;


const ProductsListWrapper = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
`;

const NewProductsMarqueeBreakout = styled.div`
    box-sizing: border-box;
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;
`;

const NewProductsMarqueeScroll = styled.div`
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 8px;
    box-sizing: border-box;
    margin-inline: 20px;
    width: auto;
    max-width: none;
    padding-bottom: 16px;
    scrollbar-width: thin;
    scrollbar-gutter: stable;
    scrollbar-color: rgba(79, 131, 227, 0.5) rgba(9, 14, 24, 0.08);

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        border-radius: 999px;
        background: rgba(9, 14, 24, 0.06);
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 999px;
        background: rgba(79, 131, 227, 0.45);
    }
`;

const NewProductsMarqueeTrack = styled.div`
    display: flex;
    gap: 16px;
    width: max-content;
`;

const NewProductsMarqueeItem = styled.div`
    flex: 0 0 min(46vw, 200px);
    width: min(46vw, 200px);
    min-width: 0;
    scroll-snap-align: start;
`;

const ProductInfoWrapper = styled.div`
`;

const ProductPriceWrapper = styled.div`
    color: #4f83e3;
    font-weight: 600;
    span {
        font-size: 24px;
    }
`

const ProductBrandWrapper = styled.div`
    color: #666;
`;

const ProductAuthorButton = styled.button`
    span {
        font-size: 14px;
        font-weight: 500;
    }
    color: #666;
    text-decoration: none;
    text-underline-offset: 2px;

    &:hover,
    &:focus-visible {
        text-decoration: underline;
    }
`;

const ProductNameWrapper = styled.div`
    span {
        font-size: 16px;
        font-weight: 500;
    }
`;

const ProductListTitleWrapper = styled.h2`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #FFF;
`

const ProductListContainer = () => {
    return <div>
        <ProductListTitleWrapper>Популярные товары</ProductListTitleWrapper>
        <ProductList />
    </div>
}




export type ProductCardProps = {
    id: string;
    imageSrc?: string;
    imageAlt?: string;
    priceText: string;
    nameText: string;
    brandText: string;
    hideAuthor?: boolean;
};

export const ProductCard = ({
    id,
    imageSrc,
    imageAlt,
    priceText,
    nameText,
    brandText,
    hideAuthor = false,
}: ProductCardProps) => {
    const router = useRouter();
    const { storefrontProducts, storefrontAuthors } = useSellerData();
    const defaultLikedIds = storefrontProducts.filter((item) => item.favourite).map((item) => item.id);
    const { isLiked, getCartQuantity, toggleLike, setCartQuantity } = useCatalogStorage(defaultLikedIds);

    const liked = isLiked(id);
    const inCart = getCartQuantity(id) > 0;
    const selectedAuthor = storefrontAuthors.find((item) => item.name === brandText);

    const onFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        toggleLike(id);
    };

    const onCartClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setCartQuantity(id, inCart ? 0 : 1);
    };

    const onAuthorClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!selectedAuthor) {
            return;
        }
        router.push(`/authors/${selectedAuthor.id}`);
    };

    const onProductOpen = () => {
        router.push(`/product/${id}`);
    };

    return (
        <ProductCardWrapper
            role="link"
            tabIndex={0}
            onClick={onProductOpen}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onProductOpen();
                }
            }}
        >
            <ProductImageContainerWrapper>
                <img src={imageSrc ?? "none"} alt={imageAlt} />
            </ProductImageContainerWrapper>
            <ProductInfoWrapper>
                <ProductPriceAndActionsRow>
                    <ProductPriceWrapper>
                        <span>{priceText}</span>
                    </ProductPriceWrapper>
                    <ProductActionButtons>
                        <ProductActionButton $active={liked} type="button" onClick={onFavoriteClick} aria-label={`Toggle favorite ${nameText}`}>
                            <Heart fill={liked ? "#fff" : "none"} stroke={liked ? "#fff" : "#4f83e3"} strokeWidth={2} />
                        </ProductActionButton>
                        {/* <ProductActionButton $active={inCart} type="button" onClick={onCartClick} aria-label={`Toggle cart ${nameText}`}>
                            <ShoppingCart size={14} stroke={inCart ? "#fff" : "#4f83e3"} strokeWidth={2} />
                        </ProductActionButton> */}
                    </ProductActionButtons>
                </ProductPriceAndActionsRow>
                <ProductNameWrapper>
                    <span>{nameText}</span>
                </ProductNameWrapper>
                {!hideAuthor && (
                    <ProductBrandWrapper>
                        <ProductAuthorButton type="button" onClick={onAuthorClick} aria-label={`Перейти к автору ${brandText}`}>
                            <span>{brandText}</span>
                        </ProductAuthorButton>
                    </ProductBrandWrapper>
                )}
            </ProductInfoWrapper>
        </ProductCardWrapper>
    );
};

export const ProductList = () => {
    const { storefrontProducts } = useSellerData();
    return <ProductsListWrapper>
        {storefrontProducts.map((product: ProductCardProps) => (
            <li key={product.id}>
                <ProductCard
                    {...product}
                />
            </li>
        ))}
    </ProductsListWrapper>
}

type NewProductsMarqueeProps = {
    products?: ProductCardProps[];
    hideAuthor?: boolean;
    ariaLabel?: string;
};

export const NewProductsMarquee = ({
    products,
    hideAuthor = false,
    ariaLabel = "Новые товары",
}: NewProductsMarqueeProps) => {
    const { storefrontProducts } = useSellerData();
    const sourceProducts = products ?? storefrontProducts;
    if (sourceProducts.length === 0) {
        return null;
    }

    return (
        <NewProductsMarqueeBreakout>
            <NewProductsMarqueeScroll aria-label={ariaLabel}>
                <NewProductsMarqueeTrack>
                    {sourceProducts.map((product) => (
                        <NewProductsMarqueeItem key={product.id}>
                            <ProductCard {...product} hideAuthor={hideAuthor} />
                        </NewProductsMarqueeItem>
                    ))}
                </NewProductsMarqueeTrack>
            </NewProductsMarqueeScroll>
        </NewProductsMarqueeBreakout>
    );
}
