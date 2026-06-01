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
    max-width: 560px;
    width: 100%;
    background-color: var(--header-search-bg);
    height: var(--search-section-size);
    border: none;
    border-radius: 9999px;

    > svg {
        width: 18px;
        height: 18px;
        color: #9aa3b2;
    }

    input {
        width: 100%;
        height: 100%;
        color: #111;
        background: transparent;
        border: none;
        outline: none;

        &::placeholder {
            color: #9aa3b2;
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
    color: #9aa3b2;
    padding: 10px 8px 10px 14px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 18px;
        height: 18px;
    }
`;

const ClearSearchButtonStyles = styled.div`
    padding: 6px 10px 6px 4px;
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
        <SearchBarStyles className="flex-center pos-r fg-1" $hide={hide}>
            <SearchIcon>
                <Search />
            </SearchIcon>
            <input
                type="text"
                placeholder="Поиск"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={onSearchKeyDown}
            />
            {searchValue.length > 0 ? (
                <ClearSearchButtonStyles>
                    <ClearSearchButton onClick={() => setSearchValue("")} />
                </ClearSearchButtonStyles>
            ) : null}
        </SearchBarStyles>
    );
};

export default SearchBar;
