"use client";
// import styled from "styled-components";
import { CartItem as CartItemEntity, Product } from "@entities";





import styled from "styled-components";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { CartItem } from "@widgets";
import { priceFormatter } from "@/src/fsd/shared/formatters";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RootState } from "../../shared/store/store";
// import { RootState } from "@reduxjs/toolkit/query/react";
import { useAppDispatch, useAppSelector } from "../../shared/store/store";
import { productService } from "../../entities/product";
import {
    setAllCartItemsSelected,
    setCartItemSelected,
} from "../../shared/store/CartSlice";
import { CartSelectAllRow } from "./CartSelectAllRow";

const MainWrapper = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (min-width: 960px) {
        gap: 28px;
    }
`;

const CartTitleWrapper = styled.h1`
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--color, #132647);
`;

const CartLayout = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (min-width: 960px) {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
        gap: 24px;
        align-items: start;
    }
`;

const CartItemsCard = styled.div`
    background-color: var(--product-page-card-bg);
    border-radius: 14px;
    color: var(--product-page-card-color);
    padding: 16px;
    box-shadow: 0 8px 24px rgba(17, 31, 60, 0.05);

    @media (min-width: 960px) {
        padding: 20px 24px;
        border-radius: 16px;
    }
`;

const CartSummaryCard = styled.div`
    background-color: var(--product-page-card-bg);
    border-radius: 14px;
    color: var(--product-page-card-color);
    padding: 16px;
    box-shadow: 0 8px 24px rgba(17, 31, 60, 0.05);

    @media (min-width: 960px) {
        position: sticky;
        top: 96px;
        padding: 20px 24px;
        border-radius: 16px;
    }
`;

const CartEmptyState = styled.div`
    padding: 28px 20px;
    border-radius: 14px;
    background: var(--product-page-card-bg, #fff);
    color: var(--cart-summary-text-color, #666);
    text-align: center;
    font-size: 15px;
    line-height: 1.45;
    box-shadow: 0 8px 24px rgba(17, 31, 60, 0.05);

    @media (min-width: 960px) {
        padding: 40px 32px;
        max-width: 560px;
        margin: 0 auto;
    }
`;

const CartEmptyLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    min-height: 42px;
    padding: 8px 16px;
    border-radius: 10px;
    background: var(--main-color, #4f83e3);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: background-color 0.2s ease;

    &:hover {
        background: var(--main-color-hover, #3f74d6);
    }
`;

const CartItemsWrapper = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const CartPlusButton = styled.button`
    width: 28px;
    height: 28px;
    border-radius: 0;
    background-color: var(--main-color);
    color: var(--color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    line-height: 1;
    padding: 0;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
        background-color: var(--main-color-hover);
    }

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        background-color: var(--main-color-disabled);
    }
`;

const CartMinusButton = styled(CartPlusButton)`
    line-height: 0;
    font-size: 20px;
`;

const CartSummaryDash = styled.span`
    display: block;
    width: 100%;
    border-top: 1px dashed var(--cart-summary-dash-color);
    margin-bottom: 12px;

    @media (min-width: 960px) {
        display: none;
    }
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
        color: var(--cart-summary-text-color);
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
    background: var(--main-color);
    color: var(--color);
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
        background-color: var(--main-color-hover);
    }
`;

const CartCheckoutButton = styled.button`
    ${checkoutButtonCss}

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        background: var(--main-color-disabled);
    }

    &:disabled:hover {
        background: var(--main-color-disabled);
    }
`;

const CartCheckoutLink = styled(Link)`
    ${checkoutButtonCss}
`;

const CartStockWarning = styled.p`
    margin: 0 0 10px;
    font-size: 14px;
    font-weight: 600;
    color: var(--cart-stock-warning-color);
    line-height: 1.35;
`;

const ConfirmOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: var(--cart-modal-overlay-bg);
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
    background: var(--product-page-card-bg);
    padding: 16px;
    color: var(--product-page-card-color);
`;

const ConfirmText = styled.p`
    font-size: 14px;
    color: var(--cart-modal-caption-color);
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
    background: ${({ $danger }) => ($danger ? "var(--cart-confirm-danger-bg)" : "var(--cart-confirm-neutral-bg)")};
    color: ${({ $danger }) => ($danger ? "var(--cart-confirm-danger-color)" : "var(--cart-confirm-neutral-color)")};
`;

type ConfirmAction = {
    productId: string;
    productName: string;
    action: "minus" | "delete";
};

// export interface CartPageProps {
//     cartItems: CartItemEntity[];
// }


export const CartPage = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const cart = useAppSelector((state: RootState) => state.cart.cart);
    const selectedIds = useAppSelector((state: RootState) => state.cart.selectedIds);

    const [cartItems, setCartItems] = useState<{ product: Product, quantity: number }[]>([]);

    useEffect(() => {
        setCartItems(cart.filter((item) => queryClient.getQueryData(["product", item.product_id])).map((item) => {
            return {
                product: queryClient.getQueryData(["product", item.product_id]) as Product,
                quantity: item.quantity,
            }
        }));
    }, [cart]);

    // console.log("cart", cart);

    const [missingIds, setMissingIds] = useState<string[]>([]);

    useEffect(() => {
        const ids = cart
            .map(item => item.product_id)
            .filter(id => !queryClient.getQueryData(["product", id]));
        setMissingIds(ids);
        console.log("missingIds", ids);
    }, [cart]);

    const { data: missingProducts } = useQuery({
        queryKey: ["products-bulk", missingIds],
        queryFn: () => productService.getProductsBulk(missingIds),
        enabled: missingIds.length > 0,
    });

    // const [cartItems, setCartItems] = useState<{ product: Product, quantity: number }[]>([]);

    // useEffect(() => {
    //     // if (missingIds.length > 0) {
    //     // const { data: missingProducts } = useQuery({
    //     //     queryKey: ["products-bulk", missingIds],
    //     //     queryFn: () => productService.getProductsBulk(missingIds),
    //     //     enabled: missingIds.length > 0,
    //     // });
    //     // }
    //     // if (missingIds.length > 0) {


    //     // }


    //     setCartItems(cart.map((item) => ({
    //         product: queryClient.getQueryData(["product", item.product_id]) as Product,
    //         quantity: item.quantity,
    //     })));
    //     console.log("cart", cart.map((item) => ({
    //         product: queryClient.getQueryData(["product", item.product_id]) as Product,
    //         quantity: item.quantity,
    //     })));
    // }, [missingIds]);

    // const { data: missingProducts } = useQuery({
    //     queryKey: ["products-bulk", missingIds],
    //     queryFn: () => productService.getProductsBulk(missingIds),
    //     enabled: missingIds.length > 0,
    // });

    useEffect(() => {
        if (!missingProducts) return;

        for (const product of missingProducts) {
            queryClient.setQueryData(
                ["product", product.id],
                product
            );
        }

        const newCartItems = missingProducts.map((product) => ({
            product: product,
            quantity: cart.find((item) => item.product_id === product.id)?.quantity || 0,
        }));

        const oldCartItems = cartItems

        setCartItems([...oldCartItems, ...newCartItems]);
    }, [missingProducts, queryClient]);

    // useEffect(() => {
    //     console.log("cart", cart);
    //     const ids = cart
    //         .map(item => item.product_id)
    //         .filter(id => !queryClient.getQueryData(["product", id]));

    //     setMissingIds(ids);
    //     console.log("missingIds", ids);
    // }, [cart]);


    // const { data: missingProducts } = useQuery({
    //     queryKey: ["products-bulk", missingIds],
    //     queryFn: () => productService.getProductsBulk(missingIds),
    //     enabled: missingIds.length > 0,
    // });


    // useEffect(() => {
    //     if (!missingProducts) return;

    //     for (const product of missingProducts) {
    //         queryClient.setQueryData(
    //             ["product", product.id],
    //             product
    //         );
    //     }
    // }, [missingProducts, queryClient]);

    // const cartItems = useMemo(() => {
    //     const data = cart.map((item) => ({
    //         product: queryClient.getQueryData(["product", item.product_id]) as Product,
    //         quantity: item.quantity,
    //     }))
    //     return data;
    // }, [cart, queryClient]);



    const sortedCartItems = useMemo(() => {
        return [...cartItems].sort((a, b) => {
            const aInStock = a.product.stockCount > 0 ? 1 : 0;
            const bInStock = b.product.stockCount > 0 ? 1 : 0;
            return bInStock - aInStock;
        });
    }, [cartItems]);

    const inStockItems = useMemo(
        () => sortedCartItems.filter((item) => item.product.stockCount > 0),
        [sortedCartItems]
    );

    const inStockProductIds = useMemo(
        () => inStockItems.map((item) => item.product.id),
        [inStockItems]
    );

    const selectedInStock = inStockItems.filter((item) =>
        selectedIds.includes(item.product.id)
    );

    const hasOutOfStockInCart = sortedCartItems.some(
        (item) => item.product.stockCount <= 0
    );

    const allInStockSelected =
        inStockProductIds.length > 0 &&
        inStockProductIds.every((id) => selectedIds.includes(id));
    const someInStockSelected = inStockProductIds.some((id) =>
        selectedIds.includes(id)
    );

    useEffect(() => {
        sortedCartItems
            .filter((item) => item.product.stockCount <= 0)
            .forEach((item) => {
                if (selectedIds.includes(item.product.id)) {
                    dispatch(
                        setCartItemSelected({
                            productId: item.product.id,
                            selected: false,
                        })
                    );
                }
            });
    }, [sortedCartItems, selectedIds, dispatch]);

    const totalQuantity = selectedInStock.reduce(
        (acc, item) => acc + item.quantity,
        0
    );
    const totalPrice = selectedInStock.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );

    const didAutoSelectRef = useRef(false);

    useEffect(() => {
        if (sortedCartItems.length === 0) {
            didAutoSelectRef.current = false;
            return;
        }
        if (didAutoSelectRef.current) {
            return;
        }
        if (inStockProductIds.length === 0) {
            didAutoSelectRef.current = true;
            return;
        }
        dispatch(
            setAllCartItemsSelected({
                productIds: inStockProductIds,
                selected: true,
            })
        );
        didAutoSelectRef.current = true;
    }, [sortedCartItems.length, inStockProductIds, dispatch]);

    const handleSelectAll = useCallback(() => {
        dispatch(
            setAllCartItemsSelected({
                productIds: inStockProductIds,
                selected: !allInStockSelected,
            })
        );
    }, [inStockProductIds, allInStockSelected, dispatch]);

    return (
        <div>
            <MainWrapper className="flex-c indent-list int-16">
                <CartTitleWrapper>Корзина</CartTitleWrapper>

                {sortedCartItems.length === 0 ? (
                    <CartEmptyState>
                        В корзине пока нет товаров.
                        <div>
                            <CartEmptyLink href="/products">
                                Перейти в каталог
                            </CartEmptyLink>
                        </div>
                    </CartEmptyState>
                ) : (
                    <CartLayout>
                        <CartItemsCard>
                            {inStockProductIds.length > 0 ? (
                                <CartSelectAllRow
                                    checked={allInStockSelected}
                                    indeterminate={
                                        someInStockSelected && !allInStockSelected
                                    }
                                    onChange={handleSelectAll}
                                />
                            ) : null}
                            <CartItemsWrapper>
                                {sortedCartItems.map((item) => (
                                    <CartItem
                                        key={item.product.id}
                                        product={item.product}
                                        quantity={item.quantity}
                                    />
                                ))}
                            </CartItemsWrapper>
                        </CartItemsCard>

                        <CartSummaryCard>
                            {hasOutOfStockInCart ? (
                                <CartStockWarning>
                                    Товары без остатка нельзя выбрать для заказа
                                </CartStockWarning>
                            ) : null}
                            {selectedInStock.length === 0 ? (
                                <CartStockWarning>
                                    Выберите товары в наличии для оформления заказа
                                </CartStockWarning>
                            ) : null}
                            <CartSummaryDash />
                            <CartSummaryRow>
                                <span>Выбрано товаров</span>
                                <span>{totalQuantity} шт.</span>
                            </CartSummaryRow>
                            <CartSummaryTotalRow>
                                <span>Итого</span>
                                <span>{priceFormatter(totalPrice)}</span>
                            </CartSummaryTotalRow>
                            {selectedInStock.length === 0 ? (
                                <CartCheckoutButton type="button" disabled>
                                    Оформить заказ
                                </CartCheckoutButton>
                            ) : (
                                <CartCheckoutLink href="/checkout">
                                    Оформить заказ
                                </CartCheckoutLink>
                            )}
                        </CartSummaryCard>
                    </CartLayout>
                )}
            </MainWrapper>
            {/* {confirmAction && (
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
            )} */}
        </div>
    );
};
