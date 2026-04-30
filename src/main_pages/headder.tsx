"use client";






// ----------------------- HEADER -----------------------

import styled from "styled-components";
import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { LayoutDashboard, LayoutGrid, Search, User, Package, Heart, ShoppingCart, Store, Newspaper, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PRODUCTS_LIST } from "@/src/shared/mocks/products";
import { ACTIVE_ORDERS } from "@/src/shared/mocks/orders";
import { useCatalogStorage } from "@/src/shared/lib/catalog-storage";
import { IconActionButton } from "@/src/shared/ui/icon-action-button";

const HeaderWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    min-height: 72px;
    padding: 14px 16px;
    gap: 14px;
    background-color: #000;
`;

const HeaderOffset = styled.div`
    height: 100px;
`;

const HeaderLeftWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const HeaderRightWrapper = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const LogoWrapper = styled.div`
    width: 60px;
    min-width: 60px;
    height: 60px;
    min-height: 60px;
    border-radius: 9999px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
    }
`;

const SearchInputWrapper = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 10px;
    flex: 1;
    max-width: 360px;
    min-width: 0;
    background-color: #fff;
    height: 42px;
    border: 1px solid #d7ddea;
    > svg {
        width: 18px;
        height: 18px;
        color: #7687a8;
        margin-left: 12px;
        margin-right: 8px;
        flex-shrink: 0;
    }
    input {
        width: 100%;
        height: 100%;
        color: #111;
        padding-right: 42px;
        &::placeholder {
            color: #8a97b1;
        }
    }

    @media (max-width: 640px) {
        display: none;
    }
`;

const CatalogButtonWrapper = styled(IconActionButton) <{ $showText?: boolean }>`
    width: 42px;
    height: 42px;
    padding: 8px;
    border-radius: 10px;
    gap: 8px;

    svg {
        width: 18px;
        height: 18px;
    }

    span {
        display: ${({ $showText }) => ($showText ? "inline" : "none")};
        font-size: 13px;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
    }

    ${({ $showText }) => ($showText ? "width: auto; padding: 8px 12px;" : "")}

    @media (max-width: 640px) {
        width: auto;
        padding: 8px 12px;

        span {
            display: inline;
        }
    }

    @media (min-width: 640px) {
        width: auto;
        padding: 8px 12px;

        span {
            display: inline;
        }
    }
`;

const CatalogOverlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    inset: 0;
    z-index: 1100;
    background: rgba(6, 10, 18, 0.63);
    backdrop-filter: blur(10px);
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
    transition: opacity 0.2s ease;
`;

const CatalogPanel = styled.div`
    background: transparent;
    min-height: 100vh;
    width: 100%;
    padding: 20px 16px 28px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const CatalogContentCard = styled.section`
    width: min(100%, 680px);
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const CatalogPanelHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
`;

const CatalogPanelTitle = styled.h2`
    color: #111;
    font-size: 22px;
    font-weight: 700;
`;

const CatalogPanelDescription = styled.p`
    margin: 0;
    color: #4a5872;
    font-size: 14px;
    line-height: 1.45;
`;

const CatalogCloseButton = styled.button`
    width: 42px;
    height: 42px;
    border-radius: 10px;
    border: 1px solid #d7ddea;
    background: #e9edf5;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4f83e3;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

    &:hover {
        background: #dce4f3;
        border-color: #c8d3e8;
    }
`;

const CatalogCategoriesGrid = styled.ul`
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    list-style: none;
    padding: 0;
    margin: 0;
`;

const CatalogCategoryItem = styled.li`
    background: #f6f7f9;
    border: 1px solid #dfe5f1;
    border-radius: 10px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: #2d3a54;
    font-size: 15px;
    min-height: 56px;
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
    cursor: pointer;

    &:hover {
        background: #eef2f9;
        border-color: #d4dceb;
    }

    &:active {
        transform: translateY(1px);
    }
`;

const CatalogCategoryName = styled.span`
    font-weight: 600;
`;

const CatalogCategoryCount = styled.span`
    color: #314e7b;
    font-weight: 700;
    font-size: 14px;
    border-radius: 6px;
    background: #e4eef9;
    padding: 6px 12px;
`;

const HeadderButtonWrapper = styled.div`
    position: relative;
`

const HeaderIconLink = styled(Link) <{ $active: boolean }>`
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({ $active }) => ($active ? "#fff" : "#c8d3e8")};
    border-radius: 8px;
    border: 1px solid ${({ $active }) => ($active ? "#5f9bff" : "transparent")};
    background: ${({ $active }) => ($active ? "#1f3f76" : "transparent")};
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    position: relative;
    z-index: 1;

    svg {
        width: 18px;
        height: 18px;
    }

    &:hover {
        color: #fff;
        background: #244a8a;
        border-color: #5f9bff;
    }
`;

const ButtonBadgeWrapper = styled.div`
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 6px;
    span {
        font-size: 12px;
    }
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4f83e3;
    color: #fff;
    border-radius: 9999px;
    padding: 2px 4px;
    z-index: 3;
`

const CloseSearchButtonWrapper = styled.button`
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
`

const CATALOG_CATEGORIES = [
    { name: "Подарки и сувениры", count: "43011" },
    { name: "Украшения", count: "3042" },
    { name: "Куклы и игрушки", count: "961" },
    { name: "Канцелярские товары", count: "899" },
    { name: "Дом и интерьер", count: "847" },
    { name: "Сумки и аксессуары", count: "568" },
    { name: "Одежда", count: "384" },
    { name: "Красота и уход", count: "183" },
];

// ----------------------- HEADER -----------------------

type HeaderProps = {
    hideSearch?: boolean;
};

export const Header = ({ hideSearch = false }: HeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const currentPath = pathname ?? "";
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const defaultLikedIds = PRODUCTS_LIST.filter((item) => item.favourite).map((item) => item.id);
    const { likedIds, cartQuantities } = useCatalogStorage(defaultLikedIds);
    const cartItemsCount = Object.values(cartQuantities as Record<string, number>).filter((qty) => qty > 0).length;
    const favoritesCount = likedIds.length;
    const activeOrdersCount = ACTIVE_ORDERS.length;
    const isAdminHeader = currentPath.startsWith("/admin");
    const isModerationHeader = currentPath.startsWith("/moderation");

    useEffect(() => {
        if (!isCatalogOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsCatalogOpen(false);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isCatalogOpen]);

    const onSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }
        event.preventDefault();
        const q = searchValue.trim();
        router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    };

    return <>
        <HeaderOffset />
        <HeaderWrapper>
            <HeaderLeftWrapper>
                <Link href={isModerationHeader ? "/moderation" : isAdminHeader ? "/admin" : "/"} aria-label="Home">
                    <LogoWrapper>
                        <img src="https://sun9-14.userapi.com/s/v1/ig2/KRXsD93W8ra--rTg_L551ufuXBXWb1TS_bD6rCoL2aW7X-XzXFQJs5Bw3DuYDdaDLG-jOZfXNHtegXbqvD0JGIUk.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,1800x1800&from=bu&u=8XzLHtuQpgaanLRFnQgF5Acw-nLq12ZuwuXSl-agoNk&cs=1280x0" alt="" />
                    </LogoWrapper>
                </Link>
                {!isAdminHeader && !isModerationHeader && (
                    <CatalogButtonWrapper
                        type="button"
                        $active
                        $showText={hideSearch}
                        onClick={() => setIsCatalogOpen(true)}
                        aria-label="Открыть каталог"
                    >
                        <LayoutGrid />
                        <span>Каталог</span>
                    </CatalogButtonWrapper>
                )}
            </HeaderLeftWrapper>
            {!hideSearch && (
                <SearchInputWrapper>
                    <Search />
                    <input
                        type="text"
                        placeholder="Поиск товара"
                        aria-label="Поиск товара"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        onKeyDown={onSearchKeyDown}
                        enterKeyHint="search"
                    />
                    {searchValue.length > 0 && (
                        <CloseSearchButtonWrapper type="button" aria-label="Очистить поиск" onClick={() => setSearchValue("")}>
                            <X aria-hidden strokeWidth={2.25} />
                        </CloseSearchButtonWrapper>
                    )}
                </SearchInputWrapper>
            )}
            <HeaderRightWrapper>
                {isAdminHeader ? (
                    <>
                        <HeaderIconLink href="/admin" aria-label="Дашборд" title="Дашборд" $active={pathname === "/admin"}>
                            <LayoutDashboard />
                        </HeaderIconLink>
                        <HeaderIconLink href="/admin/products" aria-label="Товары" title="Товары" $active={currentPath.startsWith("/admin/products")}>
                            <Package />
                        </HeaderIconLink>
                        <HeaderIconLink href="/admin/feed" aria-label="Feed" title="Feed" $active={currentPath.startsWith("/admin/feed")}>
                            <Newspaper />
                        </HeaderIconLink>
                        <HeaderIconLink href="/admin/brand" aria-label="Бренд" title="Бренд" $active={pathname === "/admin/brand"}>
                            <Store />
                        </HeaderIconLink>
                    </>
                ) : isModerationHeader ? null : (
                    
                    <>
                        <HeadderButtonWrapper>
                            <HeaderIconLink href="/profile" aria-label="Профиль" title="Профиль" $active={pathname === "/profile"}>
                                <User stroke="white" />
                            </HeaderIconLink>
                        </HeadderButtonWrapper>
                        <HeadderButtonWrapper>
                            <HeaderIconLink href="/orders" aria-label="Orders" title="Заказы" $active={currentPath.startsWith("/orders")}>
                                <Package stroke="white" />
                            </HeaderIconLink>
                            {activeOrdersCount > 0 && (
                                <ButtonBadgeWrapper>
                                    <span>{activeOrdersCount}</span>
                                </ButtonBadgeWrapper>
                            )}
                        </HeadderButtonWrapper>
                        <HeadderButtonWrapper>
                            <HeaderIconLink href="/favorites" aria-label="Favorites" title="Избранное" $active={currentPath.startsWith("/favorites")}>
                                <Heart stroke="white" />
                            </HeaderIconLink>
                            {favoritesCount > 0 && (
                                <ButtonBadgeWrapper><span>{favoritesCount}</span></ButtonBadgeWrapper>
                            )}
                        </HeadderButtonWrapper>
                        <HeadderButtonWrapper>
                            <HeaderIconLink href="/cart" aria-label="Cart" title="Корзина" $active={currentPath.startsWith("/cart")}>
                                <ShoppingCart stroke="white" />
                            </HeaderIconLink>
                            {cartItemsCount > 0 && (
                                <ButtonBadgeWrapper><span>{cartItemsCount}</span></ButtonBadgeWrapper>
                            )}
                        </HeadderButtonWrapper>
                    </>
                )}
            </HeaderRightWrapper>
            <CatalogOverlay $isOpen={isCatalogOpen} onClick={() => setIsCatalogOpen(false)}>
                <CatalogPanel onClick={() => setIsCatalogOpen(false)}>
                    <CatalogContentCard onClick={(event) => event.stopPropagation()}>
                        <CatalogPanelHeader>
                            <CatalogPanelTitle>Каталог</CatalogPanelTitle>
                            <CatalogCloseButton
                                type="button"
                                aria-label="Закрыть каталог"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setIsCatalogOpen(false);
                                }}
                            >
                                <X size={18} />
                            </CatalogCloseButton>
                        </CatalogPanelHeader>
                        <CatalogPanelDescription>Быстрый доступ к основным разделам товаров.</CatalogPanelDescription>
                        <CatalogCategoriesGrid>
                            {CATALOG_CATEGORIES.map((category) => (
                                <CatalogCategoryItem key={category.name}>
                                    <CatalogCategoryName>{category.name}</CatalogCategoryName>
                                    <CatalogCategoryCount>{category.count}</CatalogCategoryCount>
                                </CatalogCategoryItem>
                            ))}
                        </CatalogCategoriesGrid>
                    </CatalogContentCard>
                </CatalogPanel>
            </CatalogOverlay>
        </HeaderWrapper>
    </>
}
