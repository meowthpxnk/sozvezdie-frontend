import HeaderLinkButton from "@shared/ui/buttons/HeaderLinkButton";
import {
    Heart,
    Image,
    LayoutDashboard,
    Newspaper,
    Package,
    ShoppingCart,
    Store,
    User,
    Users,
} from "lucide-react";

import { isNavLinkActive } from "./header-nav";

type NavMapProps = {
    pathname: string;
};

const ProfileButton = ({ pathname }: NavMapProps) => (
    <HeaderLinkButton
        href="/profile"
        Icon={User}
        active={isNavLinkActive(pathname, "/profile")}
    />
);

/** Кнопки витрины: профиль, заказы, избранное, корзина. */
export const UserButtonMap = ({ pathname }: NavMapProps) => (
    <>
        <ProfileButton pathname={pathname} />
        <HeaderLinkButton
            href="/orders"
            Icon={Package}
            active={isNavLinkActive(pathname, "/orders")}
        />
        <HeaderLinkButton
            href="/favorites"
            Icon={Heart}
            active={isNavLinkActive(pathname, "/favorites")}
        />
        <HeaderLinkButton
            href="/cart"
            Icon={ShoppingCart}
            badgeCount={10}
            active={isNavLinkActive(pathname, "/cart")}
        />
    </>
);

/** Переход в кабинет автора (продавца). */
export const AuthorManagementEntryButton = ({ pathname }: NavMapProps) => (
    <HeaderLinkButton
        href="/admin"
        Icon={LayoutDashboard}
        active={isNavLinkActive(pathname, "/admin")}
    />
);

/** Переход в кабинет модератора. */
export const ModeratorManagementEntryButton = ({ pathname }: NavMapProps) => (
    <HeaderLinkButton
        href="/moderation"
        Icon={LayoutDashboard}
        active={isNavLinkActive(pathname, "/moderation")}
    />
);

/** Переход в кабинет SuperAdmin. */
export const SuperAdminManagementEntryButton = ({ pathname }: NavMapProps) => (
    <HeaderLinkButton
        href="/super-admin"
        Icon={LayoutDashboard}
        active={isNavLinkActive(pathname, "/super-admin")}
    />
);

/** Меню управления на маршрутах /admin. */
export const AuthorManagementButtonsMap = ({ pathname }: NavMapProps) => (
    <>
        <HeaderLinkButton
            href="/admin"
            Icon={LayoutDashboard}
            active={isNavLinkActive(pathname, "/admin")}
        />
        <HeaderLinkButton
            href="/admin/products"
            Icon={Package}
            active={isNavLinkActive(pathname, "/admin/products")}
        />
        <HeaderLinkButton
            href="/admin/feed"
            Icon={Newspaper}
            active={isNavLinkActive(pathname, "/admin/feed")}
        />
        <HeaderLinkButton
            href="/admin/brand"
            Icon={Store}
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
            active={isNavLinkActive(pathname, "/moderation")}
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
            active={isNavLinkActive(pathname, "/super-admin")}
        />
        <HeaderLinkButton
            href="/super-admin/users"
            Icon={Users}
            active={isNavLinkActive(pathname, "/super-admin/users")}
        />
        <HeaderLinkButton
            href="/super-admin/banners"
            Icon={Image}
            active={isNavLinkActive(pathname, "/super-admin/banners")}
        />
        <ProfileButton pathname={pathname} />
    </>
);
