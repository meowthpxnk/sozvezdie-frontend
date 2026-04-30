"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/src/main_pages/headder";
import { ProductCard } from "@/src/main_pages/product-list";
import { useSellerData } from "@/src/shared/lib/use-seller-data";

const MainWrapper = styled.main`
    padding: 20px;
`;

const TitleWrapper = styled.h1`
    margin-bottom: 20px;
    font-size: 28px;
    color: var(--color);
`;

const FiltersContainer = styled.div`
    margin-bottom: 20px;
`;

const ControlsPlaceholder = styled.div`
    height: 52px;
`;

const FiltersFullscreen = styled.div<{ $open: boolean }>`
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(9, 14, 24, 0.57);
    backdrop-filter: blur(6px);
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
    transition: opacity 0.2s ease;
`;

const ControlsRow = styled.div<{
    $floating: boolean;
    $top: number;
    $left: number;
    $width: number;
}>`
    display: flex;
    align-items: center;
    gap: 10px;
    position: ${({ $floating }) => ($floating ? "fixed" : "relative")};
    top: ${({ $floating, $top }) => ($floating ? `${$top}px` : "auto")};
    left: ${({ $floating, $left }) => ($floating ? `${$left}px` : "auto")};
    width: ${({ $floating, $width }) => ($floating ? `${$width}px` : "auto")};
    z-index: ${({ $floating }) => ($floating ? 950 : 1)};
    transition: top 0.25s ease, left 0.25s ease, width 0.25s ease;
`;

const SearchBarWrapper = styled.div`
    position: relative;
    flex: 1;
`;

const SearchIconWrapper = styled(Search)`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #7687a8;
`;

const SearchFieldInput = styled.input<{ $showClear: boolean }>`
    width: 100%;
    height: 52px;
    border-radius: 12px;
    border: 1px solid #d7ddea;
    background: #fff;
    padding: 0 ${({ $showClear }) => ($showClear ? "42px" : "12px")} 0 38px;
    color: #111;
    box-sizing: border-box;

    &::placeholder {
        color: #8a97b1;
    }
`;

const ClearProductsSearchButton = styled.button`
    width: 28px;
    height: 28px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
    padding: 0;
    border: none;
    background-color: #e9edf5;
    color: #5d6b84;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;

    svg {
        width: 16px;
        height: 16px;
        margin: 0;
        stroke-width: 2.25;
        flex-shrink: 0;
    }

    &:hover {
        background-color: #dce4f3;
        color: #2d3a54;
    }
`;

const FilterButton = styled.button<{ $active: boolean }>`
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    border-radius: 12px;
    background: ${({ $active }) => ($active ? "#4f83e3" : "#e9edf5")};
    color: ${({ $active }) => ($active ? "#fff" : "#4f83e3")};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${({ $active }) => ($active ? "#3f74d6" : "#dce4f3")};
    }

    svg {
        width: 18px;
        height: 18px;
    }
`;

const FiltersPanel = styled.div<{ $open: boolean }>`
    position: absolute;
    inset: 0;
    background: rgba(9, 14, 24, 0.42);
    backdrop-filter: blur(8px);
    padding: 176px 20px 20px;
    transform: translateY(${({ $open }) => ($open ? "0" : "12px")});
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transition: transform 0.2s ease, opacity 0.2s ease;
`;

const FiltersContent = styled.div`
    background: #fff;
    border: 1px solid #d7ddea;
    border-radius: 14px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const FilterSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const FilterSectionTitle = styled.span`
    font-size: 14px;
    font-weight: 700;
    color: #2d3a54;
`;

const FilterChips = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const FilterChip = styled.button<{ $active?: boolean }>`
    min-height: 36px;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 14px;
    border: 1px solid ${({ $active }) => ($active ? "#4f83e3" : "#d7ddea")};
    background: ${({ $active }) => ($active ? "#4f83e3" : "#e9edf5")};
    color: ${({ $active }) => ($active ? "#fff" : "#2d3a54")};
    transition: background-color 0.2s ease, border-color 0.2s ease;

    &:hover {
        background: ${({ $active }) => ($active ? "#3f74d6" : "#dce4f3")};
        border-color: ${({ $active }) => ($active ? "#3f74d6" : "#c8d3e8")};
    }
`;

const ProductsListWrapper = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
`;

const EmptySearchResult = styled.p`
    margin-top: 10px;
    font-size: 16px;
    font-weight: 500;
    color: #5d6b84;
`;

const CATEGORIES = ["Подарки и сувениры", "Украшения", "Дом и интерьер", "Одежда", "Канцелярия"];
const FIXED_HEADER_HEIGHT = 100;
const FLOATING_CONTROLS_TOP_OFFSET = 12;

type SortType = "popular" | "price-asc" | "price-desc";

const getPriceValue = (priceText: string) => Number(priceText.replace(/[^\d]/g, ""));

function ProductsPageContent() {
    const { storefrontProducts } = useSellerData();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState("");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isControlsFloating, setIsControlsFloating] = useState(false);
    const [sortType, setSortType] = useState<SortType>("popular");
    const [controlsMetrics, setControlsMetrics] = useState({ top: 0, left: 0, width: 0 });
    const controlsRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const visibleProducts = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();
        const filteredProducts = storefrontProducts.filter((product) => {
            if (!normalizedSearch) {
                return true;
            }

            return product.nameText.toLowerCase().includes(normalizedSearch);
        });

        if (sortType === "price-asc") {
            return [...filteredProducts].sort((a, b) => getPriceValue(a.priceText) - getPriceValue(b.priceText));
        }

        if (sortType === "price-desc") {
            return [...filteredProducts].sort((a, b) => getPriceValue(b.priceText) - getPriceValue(a.priceText));
        }

        return filteredProducts;
    }, [searchValue, sortType, storefrontProducts]);

    useEffect(() => {
        setSearchValue(searchParams?.get("q") ?? "");
    }, [searchParams]);

    useEffect(() => {
        document.body.style.overflow = isFiltersOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isFiltersOpen]);

    const openFilters = () => {
        if (!controlsRef.current) {
            setIsFiltersOpen(true);
            return;
        }

        const rect = controlsRef.current.getBoundingClientRect();
        setControlsMetrics({
            top: rect.top,
            left: rect.left,
            width: rect.width,
        });
        setIsControlsFloating(true);
        setIsFiltersOpen(true);

        requestAnimationFrame(() => {
            setControlsMetrics({
                top: FIXED_HEADER_HEIGHT + FLOATING_CONTROLS_TOP_OFFSET,
                left: 20,
                width: window.innerWidth - 40,
            });
        });
    };

    const closeFilters = () => {
        if (!containerRef.current) {
            setIsFiltersOpen(false);
            setIsControlsFloating(false);
            return;
        }

        setIsFiltersOpen(false);

        const rect = containerRef.current.getBoundingClientRect();
        requestAnimationFrame(() => {
            setControlsMetrics({
                top: rect.top,
                left: rect.left,
                width: rect.width,
            });
        });

        window.setTimeout(() => {
            setIsControlsFloating(false);
        }, 250);
    };

    return (
        <div>
            <Header hideSearch />
            <MainWrapper>
                <TitleWrapper>Все товары</TitleWrapper>
                <FiltersContainer ref={containerRef}>
                    {isControlsFloating ? <ControlsPlaceholder /> : null}
                    <ControlsRow
                        ref={controlsRef}
                        $floating={isControlsFloating}
                        $top={controlsMetrics.top}
                        $left={controlsMetrics.left}
                        $width={controlsMetrics.width}
                    >
                        <SearchBarWrapper>
                            <SearchIconWrapper />
                            <SearchFieldInput
                                type="text"
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder="Поиск товара"
                                aria-label="Поиск товара или автора"
                                $showClear={searchValue.length > 0}
                            />
                            {searchValue.length > 0 ? (
                                <ClearProductsSearchButton
                                    type="button"
                                    aria-label="Очистить поиск"
                                    onClick={() => setSearchValue("")}
                                >
                                    <X aria-hidden strokeWidth={2.25} />
                                </ClearProductsSearchButton>
                            ) : null}
                        </SearchBarWrapper>
                        <FilterButton
                            type="button"
                            $active={isFiltersOpen}
                            aria-label={isFiltersOpen ? "Закрыть фильтры" : "Открыть фильтры"}
                            onClick={isFiltersOpen ? closeFilters : openFilters}
                        >
                            <SlidersHorizontal size={16} />
                        </FilterButton>
                    </ControlsRow>
                </FiltersContainer>

                <FiltersFullscreen $open={isFiltersOpen}>
                    <FiltersPanel $open={isFiltersOpen}>
                        <FiltersContent>
                            <FilterSection>
                                <FilterSectionTitle>Категория</FilterSectionTitle>
                                <FilterChips>
                                    {CATEGORIES.map((category) => (
                                        <FilterChip key={category} type="button">
                                            {category}
                                        </FilterChip>
                                    ))}
                                </FilterChips>
                            </FilterSection>

                            <FilterSection>
                                <FilterSectionTitle>Сортировка</FilterSectionTitle>
                                <FilterChips>
                                    <FilterChip
                                        type="button"
                                        $active={sortType === "popular"}
                                        onClick={() => setSortType("popular")}
                                    >
                                        По популярности
                                    </FilterChip>
                                    <FilterChip
                                        type="button"
                                        $active={sortType === "price-asc"}
                                        onClick={() => setSortType("price-asc")}
                                    >
                                        Стоимость: по возрастанию
                                    </FilterChip>
                                    <FilterChip
                                        type="button"
                                        $active={sortType === "price-desc"}
                                        onClick={() => setSortType("price-desc")}
                                    >
                                        Стоимость: по убыванию
                                    </FilterChip>
                                </FilterChips>
                            </FilterSection>
                        </FiltersContent>
                    </FiltersPanel>
                </FiltersFullscreen>

                {visibleProducts.length === 0 ? (
                    <EmptySearchResult>Ничего не найдено</EmptySearchResult>
                ) : (
                    <ProductsListWrapper>
                        {visibleProducts.map((product) => (
                            <li key={product.id}>
                                <ProductCard {...product} />
                            </li>
                        ))}
                    </ProductsListWrapper>
                )}
            </MainWrapper>
        </div>
    );
}

function ProductsPageFallback() {
    return (
        <div>
            <Header hideSearch />
            <MainWrapper>
                <TitleWrapper>Все товары</TitleWrapper>
            </MainWrapper>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductsPageFallback />}>
            <ProductsPageContent />
        </Suspense>
    );
}
