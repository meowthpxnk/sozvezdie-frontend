"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { SetAdminChrome } from "@widgets/AdminShell";
import { IconActionButton } from "@/src/shared/ui/icon-action-button";
import {
    MODERATION_STATUS_BADGE,
    MODERATION_STATUS_LABELS,
} from "@entities/author/seller-product.types";
import { getMediaImageUrl } from "@shared/lib/media-url";
import { priceFormatter } from "@shared/formatters";
import { toast } from "sonner";
import { useAuthorProducts } from "./useAuthorProducts";

const AddProductButton = styled(Link)`
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: none;
    background: #4f83e3;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 4px;
    text-decoration: none;
    transition: background-color 0.2s ease;
    appearance: none;

    &:hover {
        background: #3f74d6;
    }

    &:focus-visible {
        outline: 2px solid #4f83e3;
        outline-offset: 2px;
    }

    svg {
        width: 14px;
        height: 14px;
    }
`;

const List = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;

    @media (min-width: 960px) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
`;

const Item = styled.li`
    background: #f6f7f9;
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    gap: 12px;
    position: relative;
    min-height: 100px;
`;

const ItemLeft = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
    flex: 1;
`;

const ItemImageWrapper = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    background: #f0f0f0;
    flex-shrink: 0;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const ItemMeta = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 4px;
    min-width: 0;
    flex: 1;
    padding-right: 84px;
`;

const ItemName = styled.strong`
    display: block;
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    color: #1f2430;
`;

const ItemActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    position: absolute;
    right: 12px;
    bottom: 10px;
`;

const EditButton = styled(Link)`
    width: 28px;
    height: 28px;
    padding: 0;
    text-decoration: none;
    border-radius: 8px;
    border: none;
    background: #4f83e3;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color 0.2s ease;
    appearance: none;

    &:hover {
        background: #3f74d6;
    }

    svg {
        width: 14px;
        height: 14px;
    }
`;

const DeleteButton = styled(IconActionButton).attrs({ $active: true })`
    background: #dc3545;
    border-color: #dc3545;
    color: #fff;

    &:hover {
        background: #c82333;
        border-color: #c82333;
    }
`;

const ItemBottomRow = styled.div`
    display: contents;
`;

const PriceStockColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
`;

const ItemPrice = styled.span`
    font-size: 20px;
    font-weight: 600;
    color: #4f83e3;
    line-height: 1.1;
`;

const ItemStock = styled.span`
    font-size: 13px;
    font-weight: 500;
    color: #666;
    text-align: left;
`;

const StatusBadge = styled.span<{ $status: keyof typeof MODERATION_STATUS_BADGE }>`
    display: inline-flex;
    align-items: center;
    width: fit-content;
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    background: ${({ $status }) => MODERATION_STATUS_BADGE[$status].background};
    color: ${({ $status }) => MODERATION_STATUS_BADGE[$status].color};
`;

const EmptyState = styled.p`
    margin: 0;
    font-size: 15px;
    color: #666;
`;

const EmptyLink = styled(Link)`
    color: #4f83e3;
    font-weight: 600;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    inset: 0;
    z-index: 1200;
    background: rgba(6, 10, 18, 0.63);
    backdrop-filter: blur(10px);
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
    transition: opacity 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const ModalCard = styled.section`
    width: min(100%, 520px);
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
`;

const ModalTitle = styled.h3`
    margin: 0;
    font-size: 20px;
    color: #111;
`;

const ModalText = styled.p`
    margin: 0;
    font-size: 14px;
    color: #4a5872;
`;

const ModalCloseButton = styled.button`
    position: absolute;
    top: 14px;
    right: 14px;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid #dc3545;
    background: #dc3545;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

const DangerButton = styled.button`
    min-height: 34px;
    padding: 0 10px;
    border-radius: 8px;
    border: 1px solid #f3c1c1;
    background: #fff5f5;
    color: #b52121;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, border-color 0.2s ease;

    &:hover {
        background: #ffe7e7;
        border-color: #e7aaaa;
    }
`;

const SecondaryButton = styled.button`
    min-height: 34px;
    padding: 0 10px;
    border-radius: 8px;
    border: 1px solid #d7ddea;
    background: #fff;
    color: #2d3a54;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
`;

const getProductImage = (images: string[]): string =>
    getMediaImageUrl(images[0]) ?? "https://placeholdpicsum.dev/photo/200/200?seed=product";

export const AuthorProductsPage = () => {
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
    const [isDeleting, setDeleting] = useState(false);
    const { products, loading, isError } = useAuthorProducts();
    const deletingProduct = products.find((product) => product.id === deletingProductId) ?? null;

    const titleRight = useMemo(
        () => (
            <AddProductButton href="/admin/products/new" aria-label="Добавить товар">
                <Plus aria-hidden />
            </AddProductButton>
        ),
        []
    );

    if (loading) {
        return (
            <>
                <SetAdminChrome title="Товары" titleRight={titleRight} />
                <EmptyState>Загрузка товаров…</EmptyState>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <SetAdminChrome title="Товары" titleRight={titleRight} />
                <EmptyState>Не удалось загрузить список товаров.</EmptyState>
            </>
        );
    }

    return (
        <>
            <SetAdminChrome title="Товары" titleRight={titleRight} />
            {products.length === 0 ? (
                <EmptyState>
                    Товаров пока нет.{" "}
                    <EmptyLink href="/admin/products/new">Создать первый товар</EmptyLink>
                </EmptyState>
            ) : (
            <List>
                {products.map((product) => (
                    <Item key={product.id}>
                        <ItemLeft>
                            <ItemImageWrapper>
                                <img src={getProductImage(product.images)} alt={product.name} />
                            </ItemImageWrapper>
                            <ItemMeta>
                                <ItemName>{product.name}</ItemName>
                                <StatusBadge $status={product.moderationStatus}>
                                    {MODERATION_STATUS_LABELS[product.moderationStatus]}
                                </StatusBadge>
                                <ItemActions>
                                    <EditButton href={`/admin/products/${product.id}/edit`} aria-label={`Редактировать ${product.name}`}>
                                        <Pencil size={14} />
                                    </EditButton>
                                    <DeleteButton
                                        type="button"
                                        aria-label={`Удалить ${product.name}`}
                                        onClick={() => {
                                            setDeletingProductId(product.id);
                                            setDeleteModalOpen(true);
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </DeleteButton>
                                </ItemActions>
                                <ItemBottomRow>
                                    <PriceStockColumn>
                                        <ItemPrice>{priceFormatter(product.price)}</ItemPrice>
                                        <ItemStock>В наличии: {product.stockCount} шт.</ItemStock>
                                    </PriceStockColumn>
                                </ItemBottomRow>
                            </ItemMeta>
                        </ItemLeft>
                    </Item>
                ))}
            </List>
            )}
            <ModalOverlay $isOpen={isDeleteModalOpen} onClick={() => (!isDeleting ? setDeleteModalOpen(false) : undefined)}>
                <ModalCard onClick={(event) => event.stopPropagation()}>
                    <ModalCloseButton
                        type="button"
                        aria-label="Закрыть модальное окно"
                        onClick={() => {
                            if (!isDeleting) {
                                setDeleteModalOpen(false);
                                setDeletingProductId(null);
                            }
                        }}
                    >
                        <X size={16} />
                    </ModalCloseButton>
                    <ModalTitle>Удалить товар?</ModalTitle>
                    <ModalText>
                        {deletingProduct ? `Товар «${deletingProduct.name}» будет удален без возможности восстановления.` : "Этот товар будет удален без возможности восстановления."}
                    </ModalText>
                    <ModalActions>
                        <SecondaryButton
                            type="button"
                            onClick={() => {
                                setDeleteModalOpen(false);
                                setDeletingProductId(null);
                            }}
                            disabled={isDeleting}
                        >
                            Отмена
                        </SecondaryButton>
                        <DangerButton
                            type="button"
                            disabled={isDeleting || !deletingProductId}
                            onClick={() => {
                                if (!deletingProductId) {
                                    return;
                                }
                                setDeleting(true);
                                toast.info("Удаление товаров будет доступно позже");
                                setDeleteModalOpen(false);
                                setDeletingProductId(null);
                                setDeleting(false);
                            }}
                        >
                            {isDeleting ? "Удаляем..." : "Да, удалить"}
                        </DangerButton>
                    </ModalActions>
                </ModalCard>
            </ModalOverlay>
        </>
    );
};
