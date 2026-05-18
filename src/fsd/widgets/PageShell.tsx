"use client";

import styled from "styled-components";
import { usePathname } from "next/navigation";
import { Header, Footer } from "@widgets";

const PATHS_WITHOUT_HEADER = ["/auth"];

const PageShellStyles = styled.div`
    min-height: 100vh;
`;

const MainContainer = styled.div`
    flex: 1 0 auto;
    min-height: 0;
    padding: 20px;

    @media (min-width: 960px) {
        padding: 24px 32px 40px;
    }
`;

export interface PageShellProps {
    children: React.ReactNode;
};

function isPathWithoutHeader(pathname: string): boolean {
    return PATHS_WITHOUT_HEADER.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
}

export const PageShell = ({ children }: PageShellProps) => {
    const pathname = usePathname();
    const hideHeader = isPathWithoutHeader(pathname);

    return <PageShellStyles className="flex-c">
        {!hideHeader ? <Header /> : null}
        <MainContainer className="flex-c">{children}</MainContainer>
        <Footer links={[
            { href: "/products", label: "Каталог" },
            { href: "/authors", label: "Авторы" },
        ]} />
    </PageShellStyles>;
};
