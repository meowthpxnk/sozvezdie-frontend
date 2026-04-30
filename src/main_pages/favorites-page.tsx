"use client";

import styled from "styled-components";
import { Header } from "@/src/main_pages/headder";
import Link from "next/link";
import { useState } from "react";
import { AUTHORS_WITH_PRODUCTS, PRODUCTS_LIST } from "@/src/shared/mocks/products";
import { ProductCard } from "@/src/main_pages/product-list";
import { readPersistedLikedIds, useCatalogStorage } from "@/src/shared/lib/catalog-storage";

const MainWrapper = styled.div`
    padding: 20px;
`;

const FavoritesTitleWrapper = styled.h2`
    margin-bottom: 20px;
    font-size: 28px;
    color: var(--color);
`;

const FavoritesSectionTitle = styled.h3`
    margin-bottom: 14px;
    font-size: 20px;
    color: var(--color);
`;

const FavoritesListWrapper = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
`;

const FavoritesSectionWrapper = styled.section`
    margin-bottom: 24px;
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

const EmptyStateWrapper = styled.div`
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    color: #666;
`;

export const FavoritesPage = () => {
    const defaultLikedIds = PRODUCTS_LIST.filter((item) => item.favourite).map((item) => item.id);
    const { likedAuthorIds } = useCatalogStorage(defaultLikedIds);

    /** Снимок id при монтировании: карточки не пропадают при снятии лайка до перезагрузки страницы. */
    const [favoriteProductIdsSnapshot] = useState(() => readPersistedLikedIds(defaultLikedIds));

    const favoriteProducts = PRODUCTS_LIST.filter((product) => favoriteProductIdsSnapshot.includes(product.id));
    const favoriteAuthors = AUTHORS_WITH_PRODUCTS.filter((author) => likedAuthorIds.includes(author.id));

    return (
        <div>
            <Header />
            <MainWrapper>
                <FavoritesTitleWrapper>Избранное</FavoritesTitleWrapper>
                <FavoritesSectionWrapper>
                    <FavoritesSectionTitle>Авторы</FavoritesSectionTitle>
                    {favoriteAuthors.length > 0 ? (
                        <AuthorsListWrapper>
                            {favoriteAuthors.map((author) => (
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
                    ) : (
                        <EmptyStateWrapper>В избранном пока нет авторов.</EmptyStateWrapper>
                    )}
                </FavoritesSectionWrapper>
                <FavoritesSectionWrapper>
                    <FavoritesSectionTitle>Товары</FavoritesSectionTitle>
                    {favoriteProducts.length > 0 ? (
                        <FavoritesListWrapper>
                            {favoriteProducts.map((product) => (
                                <li key={product.id}>
                                    <ProductCard {...product} />
                                </li>
                            ))}
                        </FavoritesListWrapper>
                    ) : (
                        <EmptyStateWrapper>В избранном пока нет товаров.</EmptyStateWrapper>
                    )}
                </FavoritesSectionWrapper>
            </MainWrapper>
        </div>
    );
};
