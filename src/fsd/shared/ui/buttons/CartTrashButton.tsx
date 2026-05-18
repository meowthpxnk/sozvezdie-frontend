import styled from "styled-components";
import { Trash2 } from "lucide-react";
import type { MouseEvent } from "react";

const CartTrashButtonStyles = styled.button<{ $active?: boolean }>`
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

export interface CartTrashButtonProps {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void,
}

export const CartTrashButton = ({ onClick }: CartTrashButtonProps) => {
    return <CartTrashButtonStyles onClick={onClick} className="cur-p size-box">
        <Trash2
            stroke="#4f83e3"
            strokeWidth={2}
        />
    </CartTrashButtonStyles>;
}
export default CartTrashButton
