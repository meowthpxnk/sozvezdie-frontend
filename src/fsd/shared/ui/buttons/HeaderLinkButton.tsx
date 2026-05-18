import styled from "styled-components";
import { LucideIcon } from "lucide-react";
import type { MouseEvent } from "react";
import Link from "next/link";

const HeaderLinkButtonStyles = styled(Link) <{ $active?: boolean }>`
    --size: 36px;
    padding: 6px;

    color: ${({ $active }) => ($active ? "#fff" : "#c8d3e8")};
    border: 1px solid ${({ $active }) => ($active ? "#5f9bff" : "transparent")};
    background: ${({ $active }) => ($active ? "#1f3f76" : "transparent")};

    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;

    &:hover {
        color: #fff;
        background: #244a8a;
        border-color: #5f9bff;
    }
`;

const ButtonBadgeWrapper = styled.div`
    top: -8px;
    right: -8px;
    height: 16px;

    background-color: var(--main-color);
    color: #fff;
    padding: 2px 4px;
    span {
        font-size: 12px;
    }
`

export interface HeaderLinkButtonProps {
    Icon: LucideIcon,
    active?: boolean,
    badgeCount?: number,
    href: string,
}

export const HeaderLinkButton = ({ Icon, href, active = false, badgeCount = 0 }: HeaderLinkButtonProps) => {
    return (
        <HeaderLinkButtonStyles
            href={href}
            className="pos-r cur-p size-box flex-center b-rad-8 zi-1"
            $active={active}
        >
            <Icon stroke="#fff" />
            {badgeCount > 0 && (
                <ButtonBadgeWrapper className="pos-a zi-2 b-rad-inf flex-center">
                    <span>{badgeCount}</span>
                </ButtonBadgeWrapper>
            )}
        </HeaderLinkButtonStyles>
    )
}
export default HeaderLinkButton
