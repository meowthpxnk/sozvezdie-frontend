"use client"

import Link from "next/link";
import styled from "styled-components";

export interface FooterLink {
    href: string;
    label: string;
}



const FooterStyles = styled.footer`
    padding: 14px 16px;
    background-color: var(--footer-bg);
    color: var(--footer-color);
    border-top: 1px solid var(--footer-separator-color);
`;

const FooterInner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    gap: 10px 20px;
`;

const FooterLink = styled(Link)`
    color: var(--footer-color);

    &:hover {
        color: var(--footer-link-hover-color);
    }
`;

const Sep = styled.span`
    opacity: 0.45;
    user-select: none;
`;

export interface FooterProps {
    links?: FooterLink[];
}

export const Footer = ({ links }: FooterProps) => {
    return <FooterStyles>
        <FooterInner className="flex ai-c jc-c">
            <span>© {new Date().getFullYear()} Созвездие | Полки</span>
            {
                links && links.map((link, index) => [
                    <Sep key={`sep-${index}`}>·</Sep>,
                    <FooterLink key={link.href} href={link.href}>
                        {link.label}
                    </FooterLink>
                ])
            }
        </FooterInner>
    </FooterStyles>;
}
