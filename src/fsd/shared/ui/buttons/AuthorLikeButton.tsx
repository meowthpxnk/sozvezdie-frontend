import styled from "styled-components";
import { Heart } from "lucide-react";
import type { MouseEvent } from "react";

const AuthorLikeButtonStyles = styled.button<{ $active?: boolean }>`
    --size: 38px;
    border-radius: 8px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 10px;
    transition: background-color 0.2s ease;
    appearance: none;

    background: ${({ $active }) => ($active ? "#4f83e3" : "rgba(255, 255, 255, 0.2)")};
    color: ${({ $active = false }) => ($active ? "#fff" : "#4f83e3")};

    &:hover {
        background: ${({ $active }) => ($active ? "#3f74d6" : "rgba(255, 255, 255, 0.28)")};
    }
`;

export interface AuthorLikeButtonProps {
    active: boolean,
    onClick: (event: MouseEvent<HTMLButtonElement>) => void,
}

export const AuthorLikeButton = ({ active, onClick }: AuthorLikeButtonProps) => {
    return <AuthorLikeButtonStyles $active={active} onClick={onClick} className="cur-p size-box">
        <Heart
            fill={active ? "#fff" : "none"}
            stroke="#fff"
            strokeWidth={2}
        />
    </AuthorLikeButtonStyles>;
}
export default AuthorLikeButton
