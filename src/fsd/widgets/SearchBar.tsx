"use client";
import { Search } from "lucide-react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import {
    useCallback,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import ClearSearchButton from "@shared/ui/buttons/ClearSearchButton";
import { buildGlobalCatalogSearchHref } from "@shared/lib/catalog-search";

const SearchBarStyles = styled.div<{ $hide?: boolean }>`
    flex: 1;
    min-width: 0;

    background-color: var(--color);
    height: var(--search-section-size);

    border: 1px solid #d7ddea;

    > svg {
        width: 18px;
        height: 18px;
        color: #7687a8;
    }
    input {
        width: 100%;
        height: 100%;
        color: #111;
        &::placeholder {
            color: #8a97b1;
        }
    }

    @media (max-width: 480px) {
        display: ${({ $hide }) => ($hide ? "none" : "flex")};
    }
`;

export interface SearchBarProps {
    hide?: boolean;
    /** Called after navigation (e.g. close mobile overlay). */
    onAfterSubmit?: () => void;
}

const SearchIcon = styled.div`
    min-width: var(--search-section-size);
    min-height: var(--search-section-size);
    color: #7687a8;
    padding: 10px;
`;

const ClearSearchButtonStyles = styled.div`
    padding: 6px;
`;

export const SearchBar = ({ hide = true, onAfterSubmit }: SearchBarProps) => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");

    const submitSearch = useCallback(() => {
        router.push(buildGlobalCatalogSearchHref(searchValue));
        onAfterSubmit?.();
    }, [onAfterSubmit, router, searchValue]);

    const onSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }
        event.preventDefault();
        submitSearch();
    };

    return (
        <SearchBarStyles
            className="flex-center pos-r b-rad-10 fg-1"
            $hide={hide}
        >
            <SearchIcon>
                <Search />
            </SearchIcon>
            <input
                type="text"
                placeholder="Поиск товара"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={onSearchKeyDown}
            />
            {searchValue.length > 0 && (
                <ClearSearchButtonStyles>
                    <ClearSearchButton onClick={() => setSearchValue("")} />
                </ClearSearchButtonStyles>
            )}
        </SearchBarStyles>
    );
};
export default SearchBar;
