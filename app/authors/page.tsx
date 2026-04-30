 "use client";

import styled from "styled-components";
import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "@/src/main_pages/headder";
import { useSellerData } from "@/src/shared/lib/use-seller-data";

const MainWrapper = styled.main`
    padding: 20px;
`;

const TitleWrapper = styled.h1`
    margin-bottom: 20px;
    font-size: 28px;
    color: var(--color);
`;

const SearchBarWrapper = styled.div`
    position: relative;
    margin-bottom: 20px;
`;

const SearchIconWrapper = styled(Search)`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #7687a8;
`;

const SearchInputWrapper = styled.input`
    width: 100%;
    height: 42px;
    border-radius: 12px;
    border: 1px solid #d7ddea;
    background: #fff;
    padding: 0 12px 0 38px;
    color: #111;

    &::placeholder {
        color: #8a97b1;
    }
`;

const AuthorsListWrapper = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
`;

const AuthorCardWrapper = styled(Link)`
    background-color: #fff;
    border-radius: 14px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: inherit;
    text-decoration: none;
`;

const AuthorAvatarWrapper = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #dfe7f7;
    color: #2f5fcb;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const AuthorNameWrapper = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: #111;
`;

export default function AuthorsPage() {
    const [searchValue, setSearchValue] = useState("");
    const { storefrontAuthors, storefrontProducts } = useSellerData();
    const authorsWithProducts = useMemo(
        () => storefrontAuthors.filter((author) => storefrontProducts.some((product) => product.brandText === author.name)),
        [storefrontAuthors, storefrontProducts]
    );
    const filteredAuthors = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();

        if (!normalizedSearch) {
            return authorsWithProducts;
        }

        return authorsWithProducts.filter((author) => author.name.toLowerCase().includes(normalizedSearch));
    }, [searchValue, authorsWithProducts]);

    return (
        <div>
            <Header />
            <MainWrapper>
                <TitleWrapper>Все авторы</TitleWrapper>
                <SearchBarWrapper>
                    <SearchIconWrapper />
                    <SearchInputWrapper
                        type="text"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Поиск автора по имени"
                        aria-label="Поиск автора по имени"
                    />
                </SearchBarWrapper>
                <AuthorsListWrapper>
                    {filteredAuthors.map((author) => (
                        <li key={author.id}>
                            <AuthorCardWrapper href={`/authors/${author.id}`}>
                                <AuthorAvatarWrapper>
                                    {author.avatarImageSrc ? (
                                        <img src={author.avatarImageSrc} alt={`Аватар автора ${author.name}`} />
                                    ) : (
                                        author.name.slice(0, 1).toUpperCase()
                                    )}
                                </AuthorAvatarWrapper>
                                <AuthorNameWrapper>{author.name}</AuthorNameWrapper>
                            </AuthorCardWrapper>
                        </li>
                    ))}
                </AuthorsListWrapper>
            </MainWrapper>
        </div>
    );
}
