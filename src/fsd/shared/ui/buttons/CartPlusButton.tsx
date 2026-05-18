import styled from "styled-components";
import { Plus } from "lucide-react";
import type { MouseEvent } from "react";

const CartPlusButtonStyles = styled.button<{ $active?: boolean, $size?: number, $padding?: number }>`
    --size: ${({ $size }) => $size ?? 28}px;
    border-radius: 0 8px 8px 0;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: ${({ $padding }) => $padding ?? 6}px;
    transition: background-color 0.2s ease;
    appearance: none;

    background: ${({ $active = false }) => ($active ? "#4f83e3" : "#e9edf5")};
    color: ${({ $active = false }) => ($active ? "#fff" : "#4f83e3")};

    &:hover {
        background: ${({ $active = false }) => ($active ? "#3f74d6" : "#dce4f3")};
    }
`;

export interface CartPlusButtonProps {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void,
    active?: boolean,
    size?: number,
    padding?: number,
}

export const CartPlusButton = ({ onClick, active = true, size = 28, padding = 6 }: CartPlusButtonProps) => {
    return <CartPlusButtonStyles $size={size} $padding={padding} $active={active} onClick={onClick} className="cur-p size-box">
        <Plus />
    </CartPlusButtonStyles>;
}
export default CartPlusButton
