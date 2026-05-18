import type { UserRole } from "@entities/user";
import { canAccessModeration, isAuthorRole, isSuperModeratorRole } from "@shared/lib/roles";

export type HeaderNavMode =
    | "storefront"
    | "author-management"
    | "moderator-management"
    | "super-admin-management";

const NAV_CONTEXT_STORAGE_KEY = "header-nav-context";

export function isManagementPath(pathname: string): boolean {
    return (
        pathname === "/admin" ||
        pathname.startsWith("/admin/") ||
        pathname === "/moderation" ||
        pathname.startsWith("/moderation/") ||
        pathname === "/super-admin" ||
        pathname.startsWith("/super-admin/")
    );
}

export function isProfilePath(pathname: string): boolean {
    return pathname === "/profile" || pathname.startsWith("/profile/");
}

function isModerationPath(pathname: string): boolean {
    return pathname === "/moderation" || pathname.startsWith("/moderation/");
}

function getManagementNavMode(role?: UserRole, pathname?: string): HeaderNavMode {
    if (pathname && isModerationPath(pathname) && canAccessModeration(role)) {
        return "moderator-management";
    }

    if (isSuperModeratorRole(role)) {
        return "super-admin-management";
    }

    if (isAuthorRole(role)) {
        return "author-management";
    }

    if (canAccessModeration(role)) {
        return "moderator-management";
    }

    return "storefront";
}

export function persistHeaderNavContext(mode: HeaderNavMode): void {
    if (typeof window === "undefined") {
        return;
    }

    sessionStorage.setItem(NAV_CONTEXT_STORAGE_KEY, mode);
}

export function readHeaderNavContext(): HeaderNavMode | null {
    if (typeof window === "undefined") {
        return null;
    }

    const value = sessionStorage.getItem(NAV_CONTEXT_STORAGE_KEY);

    if (
        value === "storefront" ||
        value === "author-management" ||
        value === "moderator-management" ||
        value === "super-admin-management"
    ) {
        return value;
    }

    return null;
}

function resolveStoredNavMode(role?: UserRole): HeaderNavMode | null {
    const stored = readHeaderNavContext();

    if (stored === "author-management" && isAuthorRole(role)) {
        return stored;
    }

    if (stored === "moderator-management" && canAccessModeration(role)) {
        return stored;
    }

    if (stored === "super-admin-management" && isSuperModeratorRole(role)) {
        return stored;
    }

    if (stored === "storefront") {
        return "storefront";
    }

    return null;
}

/** Режим навигации с учётом контекста (профиль из админки сохраняет меню управления). */
export function getHeaderNavMode(
    pathname: string,
    role?: UserRole
): HeaderNavMode {
    if (isManagementPath(pathname)) {
        return getManagementNavMode(role);
    }

    if (isProfilePath(pathname)) {
        return resolveStoredNavMode(role) ?? "storefront";
    }

    return "storefront";
}

/** Синхронизирует sessionStorage и возвращает актуальный режим навигации. */
export function syncHeaderNavContext(
    pathname: string,
    role?: UserRole
): HeaderNavMode {
    if (isManagementPath(pathname)) {
        const mode = getManagementNavMode(role, pathname);
        persistHeaderNavContext(mode);
        return mode;
    }

    if (isProfilePath(pathname)) {
        return resolveStoredNavMode(role) ?? "storefront";
    }

    persistHeaderNavContext("storefront");
    return "storefront";
}

export function isManagementNavMode(mode: HeaderNavMode): boolean {
    return mode !== "storefront";
}

export function isNavLinkActive(pathname: string, href: string): boolean {
    if (pathname === href) {
        return true;
    }

    if (href === "/") {
        return pathname === "/";
    }

    return pathname.startsWith(`${href}/`);
}
