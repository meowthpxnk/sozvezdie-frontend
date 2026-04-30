"use client";

import styled from "styled-components";
import Link from "next/link";
import type { PropsWithChildren } from "react";

const Shell = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Main = styled.div`
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
`;

const FooterBar = styled.footer`
    flex-shrink: 0;
    padding: 14px 16px;
    background-color: #000;
    color: #8a96a8;
    font-size: 13px;
    line-height: 1.4;
    border-top: 1px solid #1e2530;
`;

const FooterInner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px 20px;
`;

const FooterLink = styled(Link)`
    color: #b8c4d9;
    text-decoration: none;

    &:hover {
        color: #fff;
    }
`;

const Sep = styled.span`
    opacity: 0.45;
    user-select: none;
`;

export function PageShell({ children }: PropsWithChildren) {
    return (
        <Shell>
            <Main>{children}</Main>
            <FooterBar>
                <FooterInner>
                    <span>© {new Date().getFullYear()} Созвездие | Полки</span>
                    <Sep aria-hidden>·</Sep>
                    <FooterLink href="/products">Каталог</FooterLink>
                    <Sep aria-hidden>·</Sep>
                    <FooterLink href="/authors">Авторы</FooterLink>
                </FooterInner>
            </FooterBar>
        </Shell>
    );
}
