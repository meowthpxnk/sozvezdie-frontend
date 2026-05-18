import styled from "styled-components";
import { Heart } from "lucide-react";
import type { MouseEvent } from "react";

const ProductLikeButtonStyles = styled.button<{ $active?: boolean }>`
    --size: 28px;
    border-radius: 8px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 6px;
    transition: background-color 0.2s ease;
    appearance: none;

    background: ${({ $active = false }) => ($active ? "#4f83e3" : "#e9edf5")};
    color: ${({ $active = false }) => ($active ? "#fff" : "#4f83e3")};

    &:hover {
        background: ${({ $active = false }) => ($active ? "#3f74d6" : "#dce4f3")};
    }
`;

export interface ProductLikeButtonProps {
    active: boolean,
    onClick: (event: MouseEvent<HTMLButtonElement>) => void,
}

export const ProductLikeButton = ({ active, onClick }: ProductLikeButtonProps) => {
    return <ProductLikeButtonStyles $active={active} onClick={onClick} className="cur-p size-box">
        <Heart
            fill={active ? "var(--color)" : "none"}
            stroke={active ? "var(--color)" : "var(--main-color)"}
            strokeWidth={2}
        />
    </ProductLikeButtonStyles>;
}
export default ProductLikeButton
