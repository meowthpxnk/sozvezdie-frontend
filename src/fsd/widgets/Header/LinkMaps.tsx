"use client";

import HeaderLinkButton from "@shared/ui/buttons/HeaderLinkButton";
import { useAppSelector } from "@shared/store/store";
import {
    CircleHelp,
    Star,
    Image,
    LayoutDashboard,
    Layers,
    Newspaper,
    Package,
    ShoppingBag,
    Store,
    User,
    Users,
} from "lucide-react";

import { isNavLinkActive } from "./header-nav";

type NavMapProps = {
    pathname: string;
};

function useCartItemCount() {
    const cart = useAppSelector((state) => state.cart.cart);
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

const ProfileButton = ({ pathname }: NavMapProps) => (
    <HeaderLinkButton
        href="/profile"
        Icon={User}
        label="Профиль"
        active={isNavLinkActive(pathname, "/profile")}
    />
);

/** Кнопки витрины: профиль, заказы, избранное, корзина. */
export const UserButtonMap = ({ pathname }: NavMapProps) => {
    const cartCount = useCartItemCount();

    return (
        <>
            <ProfileButton pathname={pathname} />
            <HeaderLinkButton
                href="/orders"
                Icon={Package}
                label="Заказы"
                active={isNavLinkActive(pathname, "/orders")}
            />
            <HeaderLinkButton
                href="/favorites"
                Icon={Star}
                label="Избранное"
                active={isNavLinkActive(pathname, "/favorites")}
            />
            <HeaderLinkButton
                href="/cart"
                Icon={ShoppingBag}
                label="Корзина"
                badgeCount={cartCount}
                active={isNavLinkActive(pathname, "/cart")}
            />
        </>
    );
};

/** Переход в кабинет автора (продавца). */
export const AuthorManagementEntryButton = ({ pathname }: NavMapProps) => (
    <HeaderLinkButton
        href="/admin"
        Icon={LayoutDashboard}
        label="Кабинет"
        active={isNavLinkActive(pathname, "/admin")}
    />
);

/** Переход в кабинет модератора. */
export const ModeratorManagementEntryButton = ({ pathname }: NavMapProps) => (
    <HeaderLinkButton
        href="/moderation"
        Icon={LayoutDashboard}
        label="Модерация"
        active={isNavLinkActive(pathname, "/moderation")}
    />
);

/** Переход в кабинет SuperAdmin. */
export const SuperAdminManagementEntryButton = ({ pathname }: NavMapProps) => (
    <HeaderLinkButton
        href="/super-admin"
        Icon={LayoutDashboard}
        label="Админ"
        active={isNavLinkActive(pathname, "/super-admin")}
    />
);

/** Меню управления на маршрутах /admin. */
export const AuthorManagementButtonsMap = ({ pathname }: NavMapProps) => (
    <>
        <HeaderLinkButton
            href="/admin"
            Icon={LayoutDashboard}
            label="Обзор"
            active={isNavLinkActive(pathname, "/admin")}
        />
        <HeaderLinkButton
            href="/admin/products"
            Icon={Package}
            label="Товары"
            active={isNavLinkActive(pathname, "/admin/products")}
        />
        <HeaderLinkButton
            href="/admin/feed"
            Icon={Newspaper}
            label="Лента"
            active={isNavLinkActive(pathname, "/admin/feed")}
        />
        <HeaderLinkButton
            href="/admin/brand"
            Icon={Store}
            label="Бренд"
            active={isNavLinkActive(pathname, "/admin/brand")}
        />
        <ProfileButton pathname={pathname} />
    </>
);

/** Меню управления на маршрутах /moderation. */
export const ModeratorManagementButtonsMap = ({ pathname }: NavMapProps) => (
    <>
        <HeaderLinkButton
            href="/moderation"
            Icon={Newspaper}
            label="Заявки"
            active={isNavLinkActive(pathname, "/moderation")}
        />
        <HeaderLinkButton
            href="/moderation/orders"
            Icon={Package}
            label="Заказы"
            active={isNavLinkActive(pathname, "/moderation/orders")}
        />
        <ProfileButton pathname={pathname} />
    </>
);

/** Меню управления на маршрутах /super-admin. */
export const SuperAdminManagementButtonsMap = ({ pathname }: NavMapProps) => (
    <>
        <HeaderLinkButton
            href="/super-admin"
            Icon={LayoutDashboard}
            label="Обзор"
            active={isNavLinkActive(pathname, "/super-admin")}
        />
        <HeaderLinkButton
            href="/super-admin/users"
            Icon={Users}
            label="Пользователи"
            active={isNavLinkActive(pathname, "/super-admin/users")}
        />
        <HeaderLinkButton
            href="/super-admin/banners"
            Icon={Image}
            label="Баннеры"
            active={isNavLinkActive(pathname, "/super-admin/banners")}
        />
        <HeaderLinkButton
            href="/super-admin/faq"
            Icon={CircleHelp}
            label="FAQ"
            active={isNavLinkActive(pathname, "/super-admin/faq")}
        />
        <HeaderLinkButton
            href="/super-admin/catalog"
            Icon={Layers}
            label="Каталог"
            active={isNavLinkActive(pathname, "/super-admin/catalog")}
        />
        <ProfileButton pathname={pathname} />
    </>
);
