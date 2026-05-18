"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { getAccessToken } from "@entities/auth/auth-token.service";
import { useAuth } from "@entities/auth/hooks";
import Logo from "@shared/ui/Logo";
import { isCatalogPath } from "@shared/lib/catalog-search";
import HeaderActions, { type HeaderActionsRole } from "./HeaderActions";
import { GuestHeaderAuth } from "./GuestHeaderAuth";
import HeaderSearchSection from "./HeaderSearchSection";
import {
    isManagementNavMode,
    syncHeaderNavContext,
    type HeaderNavMode,
} from "./header-nav";
import Link from "next/link";

const PAGE_CONTENT_MAX_WIDTH = 1200;

const HeaderBar = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-sizing: border-box;
    background-color: #000;
    padding: 0 20px;

    @media (min-width: 960px) {
        padding: 0 32px;
    }
`;

const HeaderInner = styled.div`
    box-sizing: border-box;
    width: 100%;
    max-width: ${PAGE_CONTENT_MAX_WIDTH}px;
    margin: 0 auto;
    min-height: 80px;
    height: 80px;
`;


export interface HeaderProps {
    /** When true, the search block is hidden (e.g. admin shell). */
    hideSearch?: boolean;
    /** Роль для правого блока кнопок. По умолчанию обычный пользовательский хедер. */
    role?: HeaderActionsRole;
}


const HeaderOffset = styled.div`
    height: 80px;
`;



const isHiddenSearchBlock = false;

export const Header = ({ hideSearch = false, role }: HeaderProps) => {
    const pathname = usePathname() ?? "";
    const { role: authRole, isAuthenticated } = useAuth();
    const [hasAccessToken, setHasAccessToken] = useState(false);
    const [navMode, setNavMode] = useState<HeaderNavMode>("storefront");
    const resolvedRole = role ?? authRole;

    useEffect(() => {
        setHasAccessToken(Boolean(getAccessToken()));
    }, [isAuthenticated]);

    useEffect(() => {
        setNavMode(syncHeaderNavContext(pathname, resolvedRole));
    }, [pathname, resolvedRole]);

    const showSearch =
        !hideSearch &&
        !isManagementNavMode(navMode) &&
        !isHiddenSearchBlock &&
        !isCatalogPath(pathname);
    const showNavActions = hasAccessToken;

    return (
        <>
            {/* HeaderOffset is used to offset the header so that the content is not hidden behind the header */}
            <HeaderOffset />
            <HeaderBar>
                <HeaderInner className="indent-box int-12 flex jc-sb ai-c">
                    <div className="flex-center indent-list int-12">
                        <Link href="/">
                            <Logo />
                        </Link>
                    </div>
                    {showSearch ? <HeaderSearchSection /> : null}
                    <div className="flex-center indent-list int-12">
                        {showNavActions ? (
                            <HeaderActions
                                key={`${pathname}-${navMode}`}
                                mode={navMode}
                                role={resolvedRole}
                                pathname={pathname}
                            />
                        ) : (
                            <GuestHeaderAuth />
                        )}
                    </div>
                </HeaderInner>
            </HeaderBar>
        </>
    );
}
export default Header
