import { LayoutGrid } from "lucide-react";
import styled from "styled-components";

const CatalogOpenButtonStyles = styled.button<{ $showText?: boolean }>`
    width: 42px;
    height: var(--search-section-size);
    padding: 8px;
    border-radius: 10px;
    gap: 8px;

    background-color: var(--main-color);
    color: var(--color);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

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
            display: none;
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


export interface CatalogOpenButtonProps {
    onClick: () => void;
}

export const CatalogOpenButton = ({ onClick }: CatalogOpenButtonProps) => {
    return <CatalogOpenButtonStyles
        onClick={onClick}
    >
        <LayoutGrid />
        <span>Каталог</span>
    </CatalogOpenButtonStyles>;
}
export default CatalogOpenButton
