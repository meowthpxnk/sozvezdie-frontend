"use client";

import Link from "next/link";
import styled from "styled-components";
import { AdminShell } from "@/src/main_pages/admin-shell";
import { useSellerData } from "@/src/shared/lib/use-seller-data";

const DashboardLayout = styled.section`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const HeroCard = styled.section`
    background: linear-gradient(135deg, #1e2f56 0%, #355ea7 45%, #4f83e3 100%);
    border-radius: 16px;
    padding: 18px;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const HeroTitle = styled.h2`
    margin: 0;
    font-size: 22px;
    font-weight: 700;
`;

const HeroText = styled.p`
    margin: 0;
    font-size: 14px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.9);
`;

const QuickActions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const ActionButton = styled(Link)`
    text-decoration: none;
    border-radius: 10px;
    padding: 9px 14px;
    font-size: 14px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.28);
    transition: background-color 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.24);
    }
`;

const StatsGrid = styled.section`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
`;

const Card = styled.div`
    background: #fff;
    border: 1px solid #e8ecf5;
    border-radius: 14px;
    padding: 14px;
    box-shadow: 0 8px 24px rgba(17, 31, 60, 0.05);
`;

const Label = styled.div`
    color: #5d6b84;
    font-size: 13px;
`;

const Value = styled.div`
    margin-top: 6px;
    font-size: 24px;
    font-weight: 700;
    color: #132647;
`;

export const AdminDashboardPage = () => {
    const { snapshot } = useSellerData();
    const products = snapshot?.products ?? [];
    const inStock = products.reduce((sum, product) => sum + product.stockCount, 0);
    const pending = products.filter((product) => product.moderationStatus === "pending").length;

    return (
        <AdminShell title="Дашборд">
            <DashboardLayout>
                <HeroCard>
                    <HeroTitle>{snapshot?.brand.brandName ?? "KERE"}</HeroTitle>
                    <HeroText>Управляйте каталогом, отслеживайте модерацию и обновляйте карточки товаров в едином кабинете.</HeroText>
                    <QuickActions>
                        <ActionButton href="/admin/products/new">Создать товар</ActionButton>
                        <ActionButton href="/admin/brand">Редактировать бренд</ActionButton>
                    </QuickActions>
                </HeroCard>

                <StatsGrid>
                    <Card>
                        <Label>Товаров</Label>
                        <Value>{products.length}</Value>
                    </Card>
                    <Card>
                        <Label>Остаток (шт.)</Label>
                        <Value>{inStock}</Value>
                    </Card>
                    <Card>
                        <Label>На модерации</Label>
                        <Value>{pending}</Value>
                    </Card>
                    <Card>
                        <Label>Бренд</Label>
                        <Value>{snapshot?.brand.brandName ?? "KERE"}</Value>
                    </Card>
                </StatsGrid>

            </DashboardLayout>
        </AdminShell>
    );
};
