"use client";

import Link from "next/link";
import styled from "styled-components";
import { Check, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "@/src/main_pages/headder";
import { PRODUCTS_LIST } from "@/src/shared/mocks/products";
import { useCatalogStorage } from "@/src/shared/lib/catalog-storage";

/** Способ доставки */
export type CheckoutDeliveryMethod = "pickup" | "sdek";

/** Способ оплаты (скрин: при получении) */
export type CheckoutPaymentMethod = "on_receipt";

export type CheckoutOrderLine = {
    productId: string;
    title: string;
    imageSrc?: string;
    unitPriceRub: number;
    originalPriceRub?: number;
    quantity: number;
    stockCount: number;
};

export type CheckoutFormState = {
    deliveryMethod: CheckoutDeliveryMethod;
    pickupAddressText: string;
    orderStoragePeriodText: string;
    paymentMethod: CheckoutPaymentMethod;
    orderComment: string;
    sdekAddressSelected: boolean;
};

export type CheckoutSummary = {
    itemsCount: number;
    itemsSubtotalRub: number;
    discountRub: number;
    shippingLabel: "бесплатно" | "Доставка" | "СДЭК";
    shippingRub: number | null;
    totalRub: number;
};

const INFO_ALERT_TEXT =
    "Пожалуйста, проверяйте свою электронную почту. Туда будут приходить важные уведомления о статусе заказа и возможных корректировках наличия товаров.";

const DEFAULT_PICKUP_ADDRESS = "г. Санкт-Петербург, м. Петроградская, ул. Королева 61";
const DEFAULT_STORAGE_PERIOD = "5 дней с момента оформления заказа";

const MainWrapper = styled.div`
    padding: 20px;
    max-width: 1100px;
    margin: 0 auto;
`;

const PageHeader = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px 12px;
    margin-bottom: 20px;
`;

const PageTitle = styled.h1`
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--color);
`;

const PageTitleMeta = styled.span`
    font-size: 16px;
    font-weight: 500;
    color: #666;
`;

const BackToCart = styled(Link)`
    display: inline-block;
    margin-bottom: 8px;
    color: #4f83e3;
    text-decoration: none;
    font-size: 15px;
    font-weight: 600;

    &:hover,
    &:focus-visible {
        text-decoration: underline;
    }
`;

const CheckoutGrid = styled.div`
    display: grid;
    gap: 20px;
    align-items: start;

    @media (min-width: 960px) {
        grid-template-columns: minmax(0, 1fr) 360px;
    }
`;

const FormColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
`;

const SectionCard = styled.section`
    background-color: #fff;
    border-radius: 14px;
    padding: 20px;
    color: #000;
`;

const BlockTitle = styled.h2`
    margin: 0 0 14px;
    font-size: 18px;
    font-weight: 700;
    color: #000;
`;

const OptionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const OptionCardLabel = styled.label<{ $checked: boolean }>`
    position: relative;
    display: block;
    cursor: pointer;
    border-radius: 10px;
    border: 2px solid ${({ $checked }) => ($checked ? "#4f83e3" : "#e6e6e6")};
    background: #fff;
    padding: 12px 40px 12px 14px;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    box-shadow: ${({ $checked }) => ($checked ? "0 0 0 1px rgba(79, 131, 227, 0.2)" : "none")};

    &:hover {
        border-color: ${({ $checked }) => ($checked ? "#4f83e3" : "#cfd4dc")};
    }

    &:focus-within {
        outline: 2px solid #4f83e3;
        outline-offset: 2px;
    }
`;

const OptionCardInput = styled.input`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

const OptionCardTitle = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: #000;
    line-height: 1.35;
`;

const OptionCardHint = styled.div`
    margin-top: 4px;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    line-height: 1.35;
`;

const OptionCheck = styled.span<{ $visible: boolean }>`
    position: absolute;
    right: 12px;
    top: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #4f83e3;
    color: #fff;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    pointer-events: none;
    transition: opacity 0.15s ease;

    svg {
        width: 14px;
        height: 14px;
    }
`;

const MutedBlock = styled.div`
    margin-top: 10px;
    padding: 12px 14px;
    border-radius: 10px;
    background: #f6f7f9;
    font-size: 14px;
    font-weight: 500;
    color: #303237;
    line-height: 1.45;
`;

const MutedBlockTight = styled(MutedBlock)`
    margin-top: 0;
`;

const MutedTitle = styled.div`
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #666;
    margin-bottom: 6px;
`;

const SdekRow = styled.div`
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
`;

const SecondaryButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 38px;
    padding: 0 14px;
    border-radius: 8px;
    border: 1px solid #4f83e3;
    background: #fff;
    color: #4f83e3;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition:
        background-color 0.2s ease,
        color 0.2s ease;

    &:hover {
        background: #f0f5ff;
    }

    &:focus-visible {
        outline: 2px solid #4f83e3;
        outline-offset: 2px;
    }
`;

const SdekNote = styled.span`
    font-size: 13px;
    color: #666;
    font-weight: 500;
`;

const InfoAlert = styled.div`
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 14px;
    border-radius: 10px;
    background: #e4eef9;
    color: #314e7b;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.45;

    svg {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        margin-top: 1px;
    }
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const FieldLabel = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: #2d3a54;
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 100px;
    box-sizing: border-box;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #e6e6e6;
    font-size: 14px;
    color: #000;
    font-family: inherit;
    resize: vertical;
    line-height: 1.45;

    &:focus {
        outline: 2px solid #4f83e3;
        outline-offset: 2px;
    }
`;

const SummaryColumn = styled.aside`
    @media (min-width: 960px) {
        position: sticky;
        top: 16px;
    }
`;

const SummaryCard = styled(SectionCard)``;

const LineItemsList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 14px;
    list-style: none;
    margin: 0 0 16px;
    padding: 0;
`;

const LineItemRow = styled.li`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f6f7f9;
`;

const LineItemImageWrap = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 10px;
    overflow: hidden;
    background: #f0f0f0;
    flex-shrink: 0;
    transition: opacity 0.2s ease;

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

const LineItemImageLink = styled(Link)`
    display: flex;
    flex-shrink: 0;
    border-radius: 10px;
    text-decoration: none;
    color: inherit;

    &:focus-visible {
        outline: 2px solid #4f83e3;
        outline-offset: 2px;
    }

    &:hover ${LineItemImageWrap} {
        opacity: 0.92;
    }
`;

const LineItemBody = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const LineItemName = styled(Link)`
    font-weight: 600;
    font-size: 15px;
    line-height: 1.3;
    color: inherit;
    text-decoration: none;

    &:hover {
        color: #4f83e3;
    }
`;

const LineItemBottom = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
`;

const LineItemPrice = styled.span`
    font-weight: 600;
    color: #4f83e3;
    font-size: 17px;
`;

const LineItemOldPrice = styled.span`
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
    margin-left: 6px;
`;

/** Количество только для просмотра (как в списке заказов) */
const LineItemQtyLine = styled.span`
    color: #666;
    font-size: 13px;
    font-weight: 500;
`;

const OrderSummaryDash = styled.span`
    display: block;
    width: 100%;
    border-top: 1px dashed #cfd4dc;
    margin-bottom: 12px;
`;

const OrderSummaryRow = styled.div`
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

const OrderSummaryTotalRow = styled(OrderSummaryRow)`
    margin-bottom: 16px;
    margin-top: 4px;

    span {
        font-size: 18px;
        font-weight: 700;
    }
`;

const PrimaryWideButton = styled.button`
    width: 100%;
    min-height: 44px;
    border-radius: 8px;
    border: none;
    background: #4f83e3;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background: #3f74d6;
    }

    &:focus-visible {
        outline: 2px solid #4f83e3;
        outline-offset: 2px;
    }
`;

const LegalNote = styled.p`
    margin: 12px 0 0;
    font-size: 12px;
    font-weight: 500;
    color: #666;
    line-height: 1.45;
    text-align: center;
`;

const EmptyState = styled.div`
    padding: 28px 20px;
    border-radius: 14px;
    background: #fff;
    color: #666;
    text-align: center;
    font-size: 15px;
    line-height: 1.45;
    max-width: 420px;
`;

const EmptyLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    min-height: 42px;
    padding: 0 20px;
    border-radius: 10px;
    background: #4f83e3;
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover {
        background: #3f74d6;
    }
`;

function formatRub(n: number): string {
    return `${n.toLocaleString("ru-RU")} ₽`;
}

function formatItemsCountRu(n: number): string {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) {
        return `${n} товар`;
    }
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 > 20)) {
        return `${n} товара`;
    }
    return `${n} товаров`;
}

export const CheckoutPage = () => {
    const defaultLikedIds = useMemo(
        () =>
            PRODUCTS_LIST.filter((item) => "favourite" in item && Boolean(item.favourite)).map((item) => item.id),
        [],
    );
    const { cartQuantities } = useCatalogStorage(defaultLikedIds);

    const lines = useMemo((): CheckoutOrderLine[] => {
        return PRODUCTS_LIST.filter((p) => (cartQuantities[p.id] ?? 0) > 0).map((p) => {
            const unitPriceRub = Number.parseInt(p.priceText.replace(/[^\d]/g, ""), 10) || 0;
            return {
                productId: p.id,
                title: p.nameText,
                imageSrc: p.imageSrc,
                unitPriceRub,
                quantity: cartQuantities[p.id] ?? 0,
                stockCount: p.stockCount,
            };
        });
    }, [cartQuantities]);

    const [form, setForm] = useState<CheckoutFormState>({
        deliveryMethod: "pickup",
        pickupAddressText: DEFAULT_PICKUP_ADDRESS,
        orderStoragePeriodText: DEFAULT_STORAGE_PERIOD,
        paymentMethod: "on_receipt",
        orderComment: "",
        sdekAddressSelected: false,
    });

    const itemsCount = lines.reduce((acc, l) => acc + l.quantity, 0);
    const itemsSubtotalRub = lines.reduce((acc, l) => acc + l.unitPriceRub * l.quantity, 0);
    const discountRub = itemsSubtotalRub > 0 ? Math.min(40, Math.floor(itemsSubtotalRub * 0.04)) : 0;
    const shippingRub = form.deliveryMethod === "pickup" ? 0 : null;
    const totalRub = itemsSubtotalRub - discountRub + (shippingRub ?? 0);

    const onConfirmOrder = () => {
        const summary: CheckoutSummary = {
            itemsCount,
            itemsSubtotalRub,
            discountRub,
            shippingLabel: form.deliveryMethod === "pickup" ? "бесплатно" : "СДЭК",
            shippingRub,
            totalRub,
        };
        console.log("checkout:confirm", { form, lines, summary });
    };

    if (lines.length === 0) {
        return (
            <div>
                <Header />
                <MainWrapper>
                    <EmptyState>
                        Корзина пуста — добавьте товары, чтобы оформить заказ.
                        <div>
                            <EmptyLink href="/cart">Перейти в корзину</EmptyLink>
                        </div>
                    </EmptyState>
                </MainWrapper>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <MainWrapper>
                <BackToCart href="/cart">← Корзина</BackToCart>
                <PageHeader>
                    <PageTitle>Оформление заказа</PageTitle>
                    <PageTitleMeta>{formatItemsCountRu(itemsCount)}</PageTitleMeta>
                </PageHeader>

                <CheckoutGrid>
                    <FormColumn>
                        <SectionCard aria-labelledby="delivery-heading">
                            <BlockTitle id="delivery-heading">Способ доставки</BlockTitle>
                            <OptionList>
                                <OptionCardLabel $checked={form.deliveryMethod === "pickup"}>
                                    <OptionCardInput
                                        type="radio"
                                        name="delivery"
                                        checked={form.deliveryMethod === "pickup"}
                                        onChange={() => setForm((f) => ({ ...f, deliveryMethod: "pickup" }))}
                                    />
                                    <OptionCheck $visible={form.deliveryMethod === "pickup"}>
                                        <Check strokeWidth={3} />
                                    </OptionCheck>
                                    <OptionCardTitle>Самовывоз</OptionCardTitle>
                                    <OptionCardHint>бесплатно</OptionCardHint>
                                </OptionCardLabel>

                                <OptionCardLabel $checked={form.deliveryMethod === "sdek"}>
                                    <OptionCardInput
                                        type="radio"
                                        name="delivery"
                                        checked={form.deliveryMethod === "sdek"}
                                        onChange={() => setForm((f) => ({ ...f, deliveryMethod: "sdek" }))}
                                    />
                                    <OptionCheck $visible={form.deliveryMethod === "sdek"}>
                                        <Check strokeWidth={3} />
                                    </OptionCheck>
                                    <OptionCardTitle>Доставка</OptionCardTitle>
                                    <OptionCardHint>По всей России</OptionCardHint>
                                </OptionCardLabel>
                            </OptionList>

                            {form.deliveryMethod === "sdek" && (
                                <SdekRow>
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, sdekAddressSelected: true }))}
                                    >
                                        Выберите адрес
                                    </SecondaryButton>
                                    {form.sdekAddressSelected ? (
                                        <SdekNote>Адрес выбран (заглушка)</SdekNote>
                                    ) : null}
                                </SdekRow>
                            )}
                        </SectionCard>

                        {form.deliveryMethod === "pickup" && (
                            <SectionCard aria-labelledby="pickup-heading">
                                <BlockTitle id="pickup-heading">Адрес самовывоза</BlockTitle>
                                <MutedBlock>{form.pickupAddressText}</MutedBlock>
                                <MutedTitle style={{ marginTop: 16 }}>Срок хранения заказа</MutedTitle>
                                <MutedBlockTight as="p">{form.orderStoragePeriodText}</MutedBlockTight>
                            </SectionCard>
                        )}

                        <SectionCard aria-labelledby="payment-heading">
                            <BlockTitle id="payment-heading">Способ оплаты</BlockTitle>
                            <OptionList>
                                <OptionCardLabel $checked={form.paymentMethod === "on_receipt"}>
                                    <OptionCardInput
                                        type="radio"
                                        name="payment"
                                        checked={form.paymentMethod === "on_receipt"}
                                        onChange={() => setForm((f) => ({ ...f, paymentMethod: "on_receipt" }))}
                                    />
                                    <OptionCheck $visible={form.paymentMethod === "on_receipt"}>
                                        <Check strokeWidth={3} />
                                    </OptionCheck>
                                    <OptionCardTitle>При получении</OptionCardTitle>
                                    <OptionCardHint>Наличными или картой</OptionCardHint>
                                </OptionCardLabel>
                            </OptionList>
                        </SectionCard>

                        <SectionCard aria-labelledby="comment-heading">
                            <FieldGroup>
                                <FieldLabel id="comment-heading" htmlFor="checkout-comment">
                                    Комментарий к заказу
                                </FieldLabel>
                                <TextArea
                                    id="checkout-comment"
                                    name="orderComment"
                                    value={form.orderComment}
                                    onChange={(e) => setForm((f) => ({ ...f, orderComment: e.target.value }))}
                                    placeholder="Необязательно"
                                />
                            </FieldGroup>
                        </SectionCard>
                    </FormColumn>

                    <SummaryColumn>
                        <SummaryCard aria-labelledby="summary-heading">
                            <BlockTitle id="summary-heading">Содержимое заказа</BlockTitle>
                            <LineItemsList>
                                {lines.map((line) => {
                                    const lineTotal = line.unitPriceRub * line.quantity;
                                    return (
                                        <LineItemRow key={line.productId}>
                                            <LineItemImageLink
                                                href={`/product/${line.productId}`}
                                                aria-label={`Открыть ${line.title}`}
                                            >
                                                <LineItemImageWrap>
                                                    {line.imageSrc ? (
                                                        <img src={line.imageSrc} alt={line.title} />
                                                    ) : null}
                                                </LineItemImageWrap>
                                            </LineItemImageLink>
                                            <LineItemBody>
                                                <LineItemName href={`/product/${line.productId}`}>
                                                    {line.title}
                                                </LineItemName>
                                                <LineItemBottom>
                                                    <span>
                                                        <LineItemPrice>{formatRub(lineTotal)}</LineItemPrice>
                                                        {line.originalPriceRub != null ? (
                                                            <LineItemOldPrice>
                                                                {formatRub(line.originalPriceRub)}
                                                            </LineItemOldPrice>
                                                        ) : null}
                                                    </span>
                                                    <LineItemQtyLine>{line.quantity} шт.</LineItemQtyLine>
                                                </LineItemBottom>
                                            </LineItemBody>
                                        </LineItemRow>
                                    );
                                })}
                            </LineItemsList>

                            <OrderSummaryDash />
                            <OrderSummaryRow>
                                <span>Товары ({itemsCount})</span>
                                <span>{formatRub(itemsSubtotalRub)}</span>
                            </OrderSummaryRow>
                            <OrderSummaryRow>
                                <span>Скидка</span>
                                <span>-{formatRub(discountRub)}</span>
                            </OrderSummaryRow>
                            <OrderSummaryRow>
                                <span>{form.deliveryMethod === "pickup" ? "Самовывоз" : "Доставка"}</span>
                                <span>{form.deliveryMethod === "pickup" ? "бесплатно" : "—"}</span>
                            </OrderSummaryRow>
                            <OrderSummaryTotalRow>
                                <span>Итого</span>
                                <span>{formatRub(totalRub)}</span>
                            </OrderSummaryTotalRow>

                            <PrimaryWideButton type="button" onClick={onConfirmOrder}>
                                Подтвердить заказ
                            </PrimaryWideButton>
                        </SummaryCard>
                    </SummaryColumn>
                </CheckoutGrid>
            </MainWrapper>
        </div>
    );
};
