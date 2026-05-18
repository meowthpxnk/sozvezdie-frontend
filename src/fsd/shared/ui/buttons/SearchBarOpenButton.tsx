import { LayoutGrid, Search } from "lucide-react";
import styled from "styled-components";

const SearchBarOpenButtonStyles = styled.button<{ $showText?: boolean }>`
    width: var(--search-section-size);
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

    display: none;

    @media (max-width: 480px) {
        display: flex;
    }
`;


export interface SearchBarOpenButtonProps {
    onClick: () => void;
}

export const SearchBarOpenButton = ({ onClick }: SearchBarOpenButtonProps) => {
    return <SearchBarOpenButtonStyles
        onClick={onClick}
    >
        <Search />
    </SearchBarOpenButtonStyles>;
}
export default SearchBarOpenButton
