import styled from "styled-components";
import { Heart } from "lucide-react";
import type { MouseEvent } from "react";

const AuthorInfoLikeButtonStyles = styled.button<{ $active?: boolean }>`
    --size: 56px;
    border-radius: 0 8px 8px 0;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 16px;
    transition: background-color 0.2s ease;
    appearance: none;

    background: ${({ $active = false }) => ($active ? "#4f83e3" : "#e9edf5")};
    color: ${({ $active = false }) => ($active ? "#fff" : "#4f83e3")};

    &:hover {
        background: ${({ $active = false }) => ($active ? "#3f74d6" : "#dce4f3")};
    }
`;

export interface AuthorInfoLikeButtonProps {
    active: boolean,
    onClick: (event: MouseEvent<HTMLButtonElement>) => void,
}

export const AuthorInfoLikeButton = ({ active, onClick }: AuthorInfoLikeButtonProps) => {
    return <AuthorInfoLikeButtonStyles $active={active} onClick={onClick} className="cur-p size-box">
        <Heart
            fill={active ? "var(--color)" : "none"}
            stroke={active ? "var(--color)" : "var(--main-color)"}
            strokeWidth={2}
        />
    </AuthorInfoLikeButtonStyles>;
}
export default AuthorInfoLikeButton
