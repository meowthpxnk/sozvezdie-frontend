"use client";

import styled from "styled-components";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Header } from "@/src/main_pages/headder";
import { NewProductsMarquee, ProductCard } from "@/src/main_pages/product-list";
import { useCatalogStorage } from "@/src/shared/lib/catalog-storage";
import { useSellerData } from "@/src/shared/lib/use-seller-data";

const MainWrapper = styled.div`
    padding: 20px;
`;

const AuthorBannerWrapper = styled.section<{ $backgroundImage: string }>`
    width: min(100%, 1200px);
    min-height: 192px;
    max-height: 220px;
    margin-bottom: 20px;
    border-radius: 14px;
    padding: 24px;
    background-image:
        linear-gradient(135deg, rgba(18, 19, 23, 0.85) 0%, rgba(47, 95, 203, 0.72) 100%),
        url(${({ $backgroundImage }) => $backgroundImage});
    background-size: cover;
    background-position: center;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 18px;
`;

const AuthorAvatarWrapper = styled.div`
    width: 88px;
    height: 88px;
    border-radius: 18px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.18);
    display: grid;
    place-items: center;
    font-size: 28px;
    font-weight: 700;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const AuthorBannerContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    flex-grow: 1;
`;

const AuthorBannerTopRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
`;

const AuthorBannerTitleWrapper = styled.h1`
    margin: 0;
    font-size: 28px;
    line-height: 1.1;
`;

const AuthorLikeButton = styled.button<{ $active: boolean }>`
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: ${({ $active }) => ($active ? "#4f83e3" : "rgba(255, 255, 255, 0.2)")};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
    flex-shrink: 0;

    &:hover {
        background: ${({ $active }) => ($active ? "#3f74d6" : "rgba(255, 255, 255, 0.28)")};
    }

    svg {
        width: 18px;
        height: 18px;
    }
`;

const AuthorBannerDescriptionWrapper = styled.p`
    margin: 0;
    color: rgba(255, 255, 255, 0.92);
    max-width: 720px;
    line-height: 1.45;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const SectionWrapper = styled.section`
    margin-bottom: 28px;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
    margin: 0;
    font-size: 24px;
    color: var(--color);
`;

const ShowAllButton = styled(Link)`
    color: #4f83e3;
    text-decoration: none;
    font-size: 15px;
    font-weight: 600;

    &:hover,
    &:focus-visible {
        text-decoration: underline;
    }
`;

const AuthorTitleWrapper = styled.h2`
    margin-bottom: 20px;
    font-size: 28px;
    color: var(--color);
`;

const AuthorListWrapper = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
`;

const EmptyStateWrapper = styled.div`
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    color: #666;
`;

type AuthorPageProps = {
    authorId?: string;
};

export const AuthorPage = ({ authorId }: AuthorPageProps) => {
    const { storefrontProducts, storefrontAuthors } = useSellerData();
    const defaultLikedIds = storefrontProducts.filter((item) => item.favourite).map((item) => item.id);
    const { isAuthorLiked, toggleAuthorLike } = useCatalogStorage(defaultLikedIds);
    const selectedAuthor = storefrontAuthors.find((author) => author.id === authorId);
    const productsByAuthor = storefrontProducts.filter((product) => product.brandText === selectedAuthor?.name);
    const authorName = selectedAuthor?.name ?? "Неизвестный автор";
    const authorLikeId = selectedAuthor?.id ?? "";
    const authorLiked = authorLikeId ? isAuthorLiked(authorLikeId) : false;
    const authorAvatarFallback = authorName.slice(0, 1).toUpperCase();
    const authorAvatarImage = selectedAuthor?.avatarImageSrc;
    const authorDescription =
        selectedAuthor?.description ??
        `${authorName} - автор коллекции с уникальными товарами. Здесь собраны его работы и последние новинки бренда.`;
    const authorBannerImage = selectedAuthor?.bannerImageSrc ?? "https://loremflickr.com/1280/500/art?lock=301";

    return (
        <div>
            <Header />
            <MainWrapper>
                <AuthorBannerWrapper $backgroundImage={authorBannerImage}>
                    <AuthorAvatarWrapper>
                        {authorAvatarImage ? (
                            <img src={authorAvatarImage} alt={`Аватар автора ${authorName}`} />
                        ) : (
                            authorAvatarFallback
                        )}
                    </AuthorAvatarWrapper>
                    <AuthorBannerContentWrapper>
                        <AuthorBannerTopRow>
                            <AuthorBannerTitleWrapper>{authorName}</AuthorBannerTitleWrapper>
                            {selectedAuthor ? (
                                <AuthorLikeButton
                                    type="button"
                                    $active={authorLiked}
                                    onClick={() => toggleAuthorLike(selectedAuthor.id)}
                                    aria-label="Добавить или удалить автора из избранного"
                                >
                                    <Heart fill={authorLiked ? "#fff" : "none"} stroke="#fff" strokeWidth={2} />
                                </AuthorLikeButton>
                            ) : null}
                        </AuthorBannerTopRow>
                        <AuthorBannerDescriptionWrapper>{authorDescription}</AuthorBannerDescriptionWrapper>
                    </AuthorBannerContentWrapper>
                </AuthorBannerWrapper>
                {productsByAuthor.length > 0 ? (
                    <>
                        <SectionWrapper>
                            <SectionHeader>
                                <SectionTitle>Новые товары</SectionTitle>
                                <ShowAllButton href="/products">Показать все</ShowAllButton>
                            </SectionHeader>
                            <NewProductsMarquee
                                products={productsByAuthor}
                                hideAuthor
                                ariaLabel={`Новые товары автора ${authorName}`}
                            />
                        </SectionWrapper>
                        <AuthorTitleWrapper>Товары автора</AuthorTitleWrapper>
                        <AuthorListWrapper>
                            {productsByAuthor.map((product) => (
                                <li key={product.id}>
                                    <ProductCard {...product} hideAuthor />
                                </li>
                            ))}
                        </AuthorListWrapper>
                    </>
                ) : (
                    <EmptyStateWrapper>У этого автора пока нет товаров.</EmptyStateWrapper>
                )}
            </MainWrapper>
        </div>
    );
};
