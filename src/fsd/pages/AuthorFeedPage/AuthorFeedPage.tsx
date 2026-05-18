"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Check, CircleAlert, Clock3, List as ListIcon } from "lucide-react";

import { SetAdminChrome } from "@widgets/AdminShell";
import {
    AUTHOR_FEED_OPERATION_LABELS,
    type AuthorFeedFilter,
} from "@entities/author/author-feed.types";
import {
    MODERATION_STATUS_BADGE,
    MODERATION_STATUS_LABELS,
    type ModerationStatus,
} from "@entities/author/seller-product.types";
import { formatOrderDate } from "@shared/formatters";

import { useAuthorFeed } from "./useAuthorFeed";

const FilterWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const FilterRow = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 2px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const ScrollbarTrack = styled.div`
    width: 100%;
    height: 6px;
    border-radius: 999px;
    background: rgba(9, 14, 24, 0.06);
    overflow: hidden;
`;

const ScrollbarThumb = styled.div<{ $widthPercent: number; $leftPercent: number }>`
    height: 100%;
    width: ${({ $widthPercent }) => `${$widthPercent}%`};
    transform: translateX(${({ $leftPercent }) => `${$leftPercent}%`});
    border-radius: 999px;
    background: rgba(79, 131, 227, 0.45);
    transition: transform 0.1s linear;
`;

const FilterButton = styled.button<{ $active: boolean }>`
    min-height: 30px;
    padding: 0 7px;
    border-radius: 8px;
    border: 1px solid ${({ $active }) => ($active ? "#4f83e3" : "#d7ddea")};
    background: ${({ $active }) => ($active ? "#4f83e3" : "#fff")};
    color: ${({ $active }) => ($active ? "#fff" : "#2d3a54")};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex: 0 0 auto;
    justify-content: center;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

    svg {
        width: 12px;
        height: 12px;
    }
`;

const List = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    background: #fff;
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 8px 24px rgba(17, 31, 60, 0.05);

    @media (min-width: 960px) {
        padding: 16px;
        border-radius: 14px;
    }
`;

const MetaText = styled.span`
    font-size: 12px;
    color: #6b7890;
`;

const OperationType = styled.span`
    font-size: 12px;
    color: #2f5fcb;
    font-weight: 700;
`;

const TitleText = styled.strong`
    font-size: 15px;
    color: #132647;
`;

const DetailsList = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const DetailRow = styled.li`
    font-size: 13px;
    color: #4a5872;
`;

const ModeratorNote = styled.section`
    border-radius: 10px;
    border: 1px solid #f3c1c1;
    background: #fff5f5;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const ModeratorLabel = styled.strong`
    font-size: 12px;
    color: #863838;
    text-transform: uppercase;
`;

const ModeratorText = styled.p`
    margin: 0;
    font-size: 13px;
    color: #7b2b2b;
    line-height: 1.45;
`;

const ModeratorExtendedCard = styled.section`
    border-radius: 12px;
    border: 1px solid #f2b7b7;
    background: linear-gradient(180deg, #fff5f5 0%, #fff 100%);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
`;

const Badge = styled.span<{ $status: ModerationStatus }>`
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 700;
    color: ${({ $status }) => MODERATION_STATUS_BADGE[$status].color};
    background: ${({ $status }) => MODERATION_STATUS_BADGE[$status].background};
`;

const EmptyState = styled.p`
    margin: 0;
    padding: 24px 12px;
    text-align: center;
    color: #6b7890;
    font-size: 14px;
`;

const FILTERS: { value: AuthorFeedFilter; label: string; icon: typeof ListIcon }[] = [
    { value: "ALL", label: "Все", icon: ListIcon },
    { value: "PENDING", label: "На модерации", icon: Clock3 },
    { value: "APPROVED", label: "Одобрены", icon: Check },
    { value: "REJECTED", label: "Отклонены", icon: CircleAlert },
];

export function AuthorFeedPage() {
    const { filter, setFilter, items, loading, isError } = useAuthorFeed();
    const filtersRef = useRef<HTMLDivElement | null>(null);
    const [thumbLeftPercent, setThumbLeftPercent] = useState(0);
    const [thumbWidthPercent, setThumbWidthPercent] = useState(100);

    useEffect(() => {
        const node = filtersRef.current;
        if (!node) {
            return;
        }

        const updateThumb = () => {
            const { scrollLeft, scrollWidth, clientWidth } = node;
            if (scrollWidth <= clientWidth) {
                setThumbWidthPercent(100);
                setThumbLeftPercent(0);
                return;
            }

            const widthPercent = (clientWidth / scrollWidth) * 100;
            const maxScroll = scrollWidth - clientWidth;
            const leftPercent = (scrollLeft / maxScroll) * (100 - widthPercent);
            setThumbWidthPercent(widthPercent);
            setThumbLeftPercent(leftPercent);
        };

        updateThumb();
        node.addEventListener("scroll", updateThumb, { passive: true });
        window.addEventListener("resize", updateThumb);

        return () => {
            node.removeEventListener("scroll", updateThumb);
            window.removeEventListener("resize", updateThumb);
        };
    }, []);

    return (
        <>
            <SetAdminChrome title="Feed" />
            <FilterWrap>
                <FilterRow ref={filtersRef}>
                    {FILTERS.map(({ value, label, icon: Icon }) => (
                        <FilterButton
                            key={value}
                            type="button"
                            $active={filter === value}
                            onClick={() => setFilter(value)}
                        >
                            <Icon aria-hidden />
                            {label}
                        </FilterButton>
                    ))}
                </FilterRow>
                <ScrollbarTrack>
                    <ScrollbarThumb
                        $widthPercent={thumbWidthPercent}
                        $leftPercent={thumbLeftPercent}
                    />
                </ScrollbarTrack>
            </FilterWrap>

            {loading ? <EmptyState>Загрузка ленты…</EmptyState> : null}
            {!loading && isError ? (
                <EmptyState>Не удалось загрузить ленту операций.</EmptyState>
            ) : null}
            {!loading && !isError && items.length === 0 ? (
                <EmptyState>
                    {filter === "ALL"
                        ? "Операций пока нет. Создайте товар — он появится здесь после отправки на модерацию."
                        : "Нет операций с выбранным статусом."}
                </EmptyState>
            ) : null}

            {!loading && !isError && items.length > 0 ? (
                <List>
                    {items.map((item) => {
                        const hasExtendedModeratorCard =
                            Boolean(item.moderatorComment) &&
                            item.moderatorComment!.length > 120;

                        return (
                            <Item key={item.id}>
                                <Row>
                                    <OperationType>
                                        {AUTHOR_FEED_OPERATION_LABELS[item.operationType]}
                                    </OperationType>
                                    <Badge $status={item.status}>
                                        {MODERATION_STATUS_LABELS[item.status]}
                                    </Badge>
                                </Row>
                                <TitleText>{item.title}</TitleText>
                                <MetaText>{formatOrderDate(item.createdAt)}</MetaText>
                                <DetailsList>
                                    {item.details.map((detail) => (
                                        <DetailRow key={`${item.id}-${detail}`}>{detail}</DetailRow>
                                    ))}
                                </DetailsList>
                                {item.status === "REJECTED" && item.moderatorComment ? (
                                    hasExtendedModeratorCard ? (
                                        <ModeratorExtendedCard>
                                            <ModeratorLabel>Комментарий модератора</ModeratorLabel>
                                            <ModeratorText>{item.moderatorComment}</ModeratorText>
                                        </ModeratorExtendedCard>
                                    ) : (
                                        <ModeratorNote>
                                            <ModeratorLabel>Комментарий модератора</ModeratorLabel>
                                            <ModeratorText>{item.moderatorComment}</ModeratorText>
                                        </ModeratorNote>
                                    )
                                ) : null}
                            </Item>
                        );
                    })}
                </List>
            ) : null}
        </>
    );
}
