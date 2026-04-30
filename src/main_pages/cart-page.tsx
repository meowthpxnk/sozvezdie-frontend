"use client";

import styled from "styled-components";
import { useMemo, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { Header } from "@/src/main_pages/headder";
import { PRODUCTS_LIST } from "@/src/shared/mocks/products";
import { IconActionButton } from "@/src/shared/ui/icon-action-button";
import { useCatalogStorage } from "@/src/shared/lib/catalog-storage";

const MainWrapper = styled.div`
    padding: 20px;
`;

const CartTitleWrapper = styled.h2`
    margin-bottom: 20px;
    font-size: 28px;
    color: var(--color);
`;

const CartCardWrapper = styled.div`
    background-color: #fff;
    border-radius: 14px;
    padding: 20px;
    color: #000;
`;

const CartItemsWrapper = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const CartItemRow = styled.li`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;

    padding: 10px 12px;
    border-radius: 10px;
    background: #f6f7f9;
`;

const CartItemLeft = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
`;

const CartItemImageWrapper = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    background-color: #f0f0f0;
    flex-shrink: 0;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    /* Keep sizing but hide the image when it is "none" */
    img[src="none"] {
        visibility: hidden;
    }
`;

const CartItemImageLink = styled(Link)`
    display: flex;
    flex-shrink: 0;
`;

const CartItemMeta = styled.div`
    display: flex;
    flex-direction: column;
    /* gap: 4px; */
    min-width: 0;
`;

const CartItemNameLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const CartItemName = styled.span`
    font-weight: 600;
    font-size: 16px;
`;

const CartItemPrice = styled.span`
    font-weight: 600;
    color: #4f83e3;
    font-size: 20px;
`;

const CartItemPriceRow = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
`;

const CartItemStock = styled.span`
    color: #666;
    font-size: 13px;
    font-weight: 500;
`;

const CartItemBrand = styled.span`
    color: #666;
    font-size: 14px;
    font-weight: 500;
`;

const CartMetaActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
`;

const CartActionButton = styled(IconActionButton)``;
const CartFavoriteButton = styled(IconActionButton) <{ $active: boolean }>``;

const CartItemRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;
    flex-shrink: 0;
`;

const CartQtyWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e6e6e6;
    background: #fff;
    /* height: 100%; */
`;

const CartQtyValue = styled.span`
    font-weight: 600;
    min-width: 18px;
    text-align: center;
    padding: 0 10px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #4f83e3;
    color: #fff;
    font-size: 16px;
`;

const CartPlusButton = styled.button`
    width: 28px;
    height: 28px;
    border-radius: 0;
    background-color: #4f83e3;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    line-height: 1;
    padding: 0;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
        background-color: #3f74d6;
    }

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        background-color: #a8b8e0;
    }
`;

const CartMinusButton = styled(CartPlusButton)`
    line-height: 0;
    font-size: 20px;
`;

const CartSummaryWrapper = styled.div`
    margin-top: 16px;
`;

const CartSummaryDash = styled.span`
    display: block;
    width: 100%;
    border-top: 1px dashed #cfd4dc;
    margin-bottom: 12px;
`;

const CartSummaryRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;

    span {
        font-size: 15px;
        font-weight: 500;
        color: #303237;
    }
`;

const CartSummaryTotalRow = styled(CartSummaryRow)`
    margin-bottom: 14px;

    span {
        font-size: 18px;
        font-weight: 700;
    }
`;

const checkoutButtonCss = `
    width: 100%;
    height: 40px;
    border-radius: 8px;
    background: #4f83e3;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    box-sizing: border-box;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #3f74d6;
    }
`;

const CartCheckoutButton = styled.button`
    ${checkoutButtonCss}

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        background: #a8b8e0;
    }

    &:disabled:hover {
        background: #a8b8e0;
    }
`;

const CartCheckoutLink = styled(Link)`
    ${checkoutButtonCss}
`;

const CartStockWarning = styled.p`
    margin: 0 0 10px;
    font-size: 14px;
    font-weight: 600;
    color: #c62828;
    line-height: 1.35;
`;

const ConfirmOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.68);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
`;

const ConfirmModal = styled.div`
    width: 100%;
    max-width: 360px;
    border-radius: 12px;
    background: #fff;
    padding: 16px;
    color: #000;
`;

const ConfirmText = styled.p`
    font-size: 14px;
    color: #4b4f56;
    margin-bottom: 14px;
`;

const ConfirmActions = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
`;

const ConfirmButton = styled.button<{ $danger?: boolean }>`
    height: 36px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    background: ${({ $danger }) => ($danger ? "#e44b4b" : "#e9edf5")};
    color: ${({ $danger }) => ($danger ? "#fff" : "#2f3440")};
`;

type ConfirmAction = {
    productId: string;
    productName: string;
    action: "minus" | "delete";
};

export const CartPage = () => {
    const defaultLikedIds = useMemo(
        () =>
            PRODUCTS_LIST.filter((item) => "favourite" in item && Boolean(item.favourite)).map(
                (item) => item.id,
            ),
        [],
    );
    const { isLiked, getCartQuantity, toggleLike, setCartQuantity } = useCatalogStorage(defaultLikedIds);
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

    const onPlus = (productId: string) => {
        const product = PRODUCTS_LIST.find((item) => item.id === productId);
        const currentQty = getCartQuantity(productId);
        if (product && currentQty >= product.stockCount) {
            return;
        }
        setCartQuantity(productId, currentQty + 1);
    };

    const onMinus = (productId: string) => {
        const currentQty = getCartQuantity(productId);
        if (currentQty > 1) {
            setCartQuantity(productId, currentQty - 1);
            return;
        }

        const product = PRODUCTS_LIST.find((item) => item.id === productId);
        if (!product) {
            return;
        }

        setConfirmAction({
            productId,
            productName: product.nameText,
            action: "delete",
        });
    };

    const onDelete = (productId: string) => {
        const product = PRODUCTS_LIST.find((item) => item.id === productId);
        if (!product) {
            return;
        }

        setConfirmAction({
            productId,
            productName: product.nameText,
            action: "delete",
        });
    };

    const onToggleLike = (productId: string) => {
        toggleLike(productId);
    };

    const visibleProducts = PRODUCTS_LIST.filter((p) => getCartQuantity(p.id) > 0);
    const totalItems = visibleProducts.reduce((acc, product) => acc + getCartQuantity(product.id), 0);
    const totalPrice = visibleProducts.reduce((acc, product) => {
        const unitPrice = Number.parseInt(product.priceText.replace(/[^\d]/g, ""), 10) || 0;
        return acc + unitPrice * getCartQuantity(product.id);
    }, 0);
    const cartExceedsStock = visibleProducts.some(
        (product) => getCartQuantity(product.id) > product.stockCount,
    );
    const canProceedToCheckout = totalItems > 0 && !cartExceedsStock;
    const getProductTotalPriceText = (productId: string, unitPriceText: string) => {
        const unitPrice = Number.parseInt(unitPriceText.replace(/[^\d]/g, ""), 10) || 0;
        const lineTotal = unitPrice * getCartQuantity(productId);
        return `${lineTotal.toLocaleString("ru-RU")} ₽`;
    };
    const onConfirmAction = () => {
        if (!confirmAction) {
            return;
        }

        if (confirmAction.action === "minus") {
            setCartQuantity(confirmAction.productId, getCartQuantity(confirmAction.productId) - 1);
        } else {
            setCartQuantity(confirmAction.productId, 0);
        }

        setConfirmAction(null);
    };

    return (
        <div>
            <Header />
            <MainWrapper>
                <CartTitleWrapper>Корзина</CartTitleWrapper>

                <CartCardWrapper>
                    <CartItemsWrapper>
                        {visibleProducts.map((product) => (
                            <CartItemRow key={product.id}>
                                <CartItemLeft>
                                    <CartItemImageLink href={`/product/${product.id}`} aria-label={`Open ${product.nameText}`}>
                                        <CartItemImageWrapper>
                                            <img src={product.imageSrc} alt={product.imageAlt ?? product.nameText} />
                                        </CartItemImageWrapper>
                                    </CartItemImageLink>
                                    <CartItemMeta>
                                        <CartItemNameLink href={`/product/${product.id}`} aria-label={`Open ${product.nameText}`}>
                                            <CartItemName>{product.nameText}</CartItemName>
                                        </CartItemNameLink>
                                        <CartMetaActions>
                                            <CartFavoriteButton
                                                $active={isLiked(product.id)}
                                                type="button"
                                                aria-label={`Favorite ${product.nameText}`}
                                                onClick={() => onToggleLike(product.id)}
                                            >
                                                <Heart
                                                    size={14}
                                                    fill={isLiked(product.id) ? "#fff" : "none"}
                                                    stroke={isLiked(product.id) ? "#fff" : "#4f83e3"}
                                                    strokeWidth={2}
                                                />
                                            </CartFavoriteButton>
                                            <CartActionButton
                                                $active={false}
                                                type="button"
                                                aria-label={`Remove ${product.nameText}`}
                                                onClick={() => onDelete(product.id)}
                                            >
                                                <Trash2 size={14} stroke="#4f83e3" strokeWidth={2} />
                                            </CartActionButton>
                                        </CartMetaActions>
                                    </CartItemMeta>
                                </CartItemLeft>

                                <CartItemRight>
                                    <CartItemPriceRow>
                                        <CartItemPrice>{getProductTotalPriceText(product.id, product.priceText)}</CartItemPrice>
                                        <CartItemStock>В наличии: {product.stockCount} шт.</CartItemStock>
                                    </CartItemPriceRow>
                                    <CartQtyWrapper>
                                        <CartMinusButton
                                            type="button"
                                            aria-label={`Remove one of ${product.nameText}`}
                                            onClick={() => onMinus(product.id)}
                                        >
                                            -
                                        </CartMinusButton>
                                        <CartQtyValue>{getCartQuantity(product.id)}</CartQtyValue>
                                        <CartPlusButton
                                            type="button"
                                            disabled={getCartQuantity(product.id) >= product.stockCount}
                                            aria-label={
                                                getCartQuantity(product.id) >= product.stockCount
                                                    ? `Достигнут лимит склада для ${product.nameText}`
                                                    : `Add one more of ${product.nameText}`
                                            }
                                            onClick={() => onPlus(product.id)}
                                        >
                                            +
                                        </CartPlusButton>
                                    </CartQtyWrapper>
                                </CartItemRight>
                            </CartItemRow>
                        ))}
                    </CartItemsWrapper>

                    <CartSummaryWrapper>
                        <CartSummaryDash />
                        <CartSummaryRow>
                            <span>Количество товаров</span>
                            <span>{totalItems} шт.</span>
                        </CartSummaryRow>
                        <CartSummaryTotalRow>
                            <span>Итого</span>
                            <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                        </CartSummaryTotalRow>
                        {cartExceedsStock && (
                            <CartStockWarning>
                                В корзине есть позиции в количестве больше, чем доступно на складе. Уменьшите количество
                                до остатка или удалите лишнее — иначе оформление заказа недоступно.
                            </CartStockWarning>
                        )}
                        {canProceedToCheckout ? (
                            <CartCheckoutLink href="/checkout">Оформить заказ</CartCheckoutLink>
                        ) : (
                            <CartCheckoutButton type="button" disabled>
                                Оформить заказ
                            </CartCheckoutButton>
                        )}
                    </CartSummaryWrapper>
                </CartCardWrapper>
            </MainWrapper>
            {confirmAction && (
                <ConfirmOverlay onClick={() => setConfirmAction(null)}>
                    <ConfirmModal onClick={(event) => event.stopPropagation()}>
                        <ConfirmText>
                            {confirmAction.action === "minus"
                                ? `Уменьшить количество товара "${confirmAction.productName}" на 1?`
                                : `Удалить товар "${confirmAction.productName}" из корзины?`}
                        </ConfirmText>
                        <ConfirmActions>
                            <ConfirmButton type="button" onClick={() => setConfirmAction(null)}>
                                Отмена
                            </ConfirmButton>
                            <ConfirmButton $danger type="button" onClick={onConfirmAction}>
                                Подтвердить
                            </ConfirmButton>
                        </ConfirmActions>
                    </ConfirmModal>
                </ConfirmOverlay>
            )}
        </div>
    );
};
