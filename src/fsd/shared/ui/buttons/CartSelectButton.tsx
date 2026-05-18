import styled from "styled-components";
import { Check } from "lucide-react";
import type { MouseEvent } from "react";

const CartSelectButtonStyles = styled.button<{ $active?: boolean; $disabled?: boolean }>`
    --size: 28px;
    border-radius: 8px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 6px;
    transition: background-color 0.2s ease, opacity 0.2s ease;
    appearance: none;
    cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
    opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};

    background: ${({ $active = false, $disabled }) =>
        $disabled ? "#e9edf5" : $active ? "#4f83e3" : "#e9edf5"};
    color: ${({ $active = false, $disabled }) =>
        $disabled ? "#9aa3b2" : $active ? "#fff" : "#4f83e3"};

    &:hover:not(:disabled) {
        background: ${({ $active = false }) => ($active ? "#3f74d6" : "#dce4f3")};
    }
`;

export interface CartSelectButtonProps {
    active: boolean;
    disabled?: boolean;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const CartSelectButton = ({
    active,
    disabled = false,
    onClick,
}: CartSelectButtonProps) => {
    return (
        <CartSelectButtonStyles
            type="button"
            $active={active}
            $disabled={disabled}
            disabled={disabled}
            onClick={onClick}
            aria-label={active ? "Снять выбор" : "Выбрать для заказа"}
            aria-pressed={active}
            className="cur-p size-box"
        >
            <Check strokeWidth={3} size={16} />
        </CartSelectButtonStyles>
    );
};

export default CartSelectButton;
