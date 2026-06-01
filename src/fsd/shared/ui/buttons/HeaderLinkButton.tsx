import styled from "styled-components";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

const HeaderLinkButtonStyles = styled(Link)<{ $active?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    min-width: 52px;
    color: var(--header-icon-color);
    background: transparent;
    text-decoration: none;
    transition: opacity 0.15s ease;

    &:hover {
        opacity: 0.65;
    }

    ${({ $active }) =>
        $active
            ? `
        span:last-child {
            color: var(--main-color);
            font-weight: 600;
        }
    `
            : ""}

    @media (max-width: 639px) {
        padding: 4px 6px;
        min-width: auto;
    }
`;

const IconWrap = styled.div`
    position: relative;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 22px;
        height: 22px;
        stroke-width: 1.75;
    }

    @media (max-width: 639px) {
        width: 20px;
        height: 20px;

        svg {
            width: 18px;
            height: 18px;
            stroke-width: 1.65;
        }
    }
`;

const Label = styled.span`
    font-size: 11px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--header-icon-color);

    @media (max-width: 639px) {
        display: none;
    }
`;

const ButtonBadgeWrapper = styled.div`
    top: -6px;
    right: -8px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    background-color: var(--main-color);
    color: #111;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
        font-size: 10px;
        font-weight: 700;
        line-height: 1;
    }

    @media (max-width: 639px) {
        top: -5px;
        right: -6px;
        min-width: 14px;
        height: 14px;
        padding: 0 3px;

        span {
            font-size: 9px;
        }
    }
`;

export interface HeaderLinkButtonProps {
    Icon: LucideIcon;
    active?: boolean;
    badgeCount?: number;
    href: string;
    label?: string;
}

export const HeaderLinkButton = ({
    Icon,
    href,
    active = false,
    badgeCount = 0,
    label,
}: HeaderLinkButtonProps) => {
    return (
        <HeaderLinkButtonStyles
            href={href}
            className="cur-p"
            $active={active}
            aria-label={label}
        >
            <IconWrap>
                <Icon stroke="currentColor" />
                {badgeCount > 0 ? (
                    <ButtonBadgeWrapper className="pos-a zi-2">
                        <span>{badgeCount > 99 ? "99+" : badgeCount}</span>
                    </ButtonBadgeWrapper>
                ) : null}
            </IconWrap>
            {label ? <Label>{label}</Label> : null}
        </HeaderLinkButtonStyles>
    );
};

export default HeaderLinkButton;
