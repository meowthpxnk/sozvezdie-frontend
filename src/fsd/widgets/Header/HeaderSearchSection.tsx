import { useModalBehavior } from "@shared/hooks/useModalBehavior";
import styled from "styled-components";
import CatalogOpenButton from "@shared/ui/buttons/CatalogOpenButton";
import SearchBarOpenButton from "@shared/ui/buttons/SearchBarOpenButton";
import { SearchBarOverlay, CatalogOverlay, SearchBar } from "@widgets";

const HeaderSearchSectionStyles = styled.div``;

export interface HeaderSearchSectionProps {

}

export const HeaderSearchSection = ({ }: HeaderSearchSectionProps) => {
    const {
        isOpen: isCatalogOpen,
        close: closeCatalog,
        open: openCatalog,
    } = useModalBehavior();

    const {
        isOpen: isSearchBarOpen,
        close: closeSearchBar,
        open: openSearchBar,
    } = useModalBehavior();

    return (
        <>
            <HeaderSearchSectionStyles className="flex-r indent-list int-12 fg-1">
                <CatalogOpenButton
                    onClick={openCatalog}
                />
                <SearchBarOpenButton
                    onClick={openSearchBar}
                />
                <SearchBar />
            </HeaderSearchSectionStyles>
            <CatalogOverlay isCatalogOpen={isCatalogOpen} close={closeCatalog} />
            <SearchBarOverlay isSearchBarOpen={isSearchBarOpen} close={closeSearchBar} />
        </>
    )
}
export default HeaderSearchSection
