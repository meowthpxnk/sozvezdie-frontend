"use client";

import styled from "styled-components";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Author, authorService } from "../../entities/author";
import { Product } from "../../entities/product";
import { ItemList } from "../../features/ItemList";
import { ProductCard } from "../../widgets";
import { useFavouriteAuthor } from "../../entities/favourite/hooks";
import { useAuth } from "../../entities/auth";
import { canAccessModeration } from "@shared/lib/roles";
import { ModeratorEditButton } from "@features/moderator-edit/ModeratorEditButton";
import { buildBrandCatalogEditHref } from "@features/moderator-edit/moderation-edit-links";
import { MEDIA_URL } from "../../shared/api/interceptors";

const PageRoot = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const MainWrapper = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (min-width: 960px) {
        gap: 28px;
    }
`;

const AuthorBannerWrapper = styled.section<{ $backgroundImage: string }>`
    width: 100%;
    min-height: 192px;
    max-height: 220px;
    border-radius: 14px;
    padding: 20px;
    background-image:
        linear-gradient(135deg, rgba(18, 19, 23, 0.85) 0%, rgba(47, 95, 203, 0.72) 100%),
        url(${({ $backgroundImage }) => $backgroundImage});
    background-size: cover;
    background-position: center;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 18px;

    @media (min-width: 640px) {
        padding: 24px;
    }
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

const AuthorBannerActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
`;

const AuthorBannerTitleWrapper = styled.h1`
    margin: 0;
    font-size: 22px;
    line-height: 1.1;

    @media (min-width: 640px) {
        font-size: 28px;
    }
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

const EmptyStateWrapper = styled.div`
    width: 100%;
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    color: #666;
    text-align: center;
`;

const ProductsSection = styled.section`
    width: 100%;
    min-width: 0;
`;

type AuthorPageProps = {
    authorId: string;
};

export const SingleAuthorPage = ({ authorId }: AuthorPageProps) => {
    const [author, setAuthor] = useState<Author>();
    const [products, setProducts] = useState<Product[]>([]);

    const { role } = useAuth();
    const isModerator = canAccessModeration(role);
    const { isFavourite, setFavourite } = useFavouriteAuthor(authorId);

    const { data, isSuccess } = useQuery({
        queryKey: ["singleAuthorData", authorId],
        queryFn: () => authorService.getAuthor(authorId),
    });

    const { data: productsData, isSuccess: isProductsSuccess } = useQuery({
        queryKey: ["productsByAuthor", authorId],
        queryFn: () => authorService.getProductsByAuthor(authorId),
    });

    useEffect(() => {
        if (isSuccess) {
            setAuthor(data);
        }
    }, [data, isSuccess]);

    useEffect(() => {
        if (isProductsSuccess) {
            setProducts(productsData ?? []);
        }
    }, [productsData, isProductsSuccess]);

    if (!author) {
        return null;
    }

    return (
        <PageRoot>
            <MainWrapper>
                <AuthorBannerWrapper
                    $backgroundImage={`${MEDIA_URL}/images-bucket/${author.bannerImage ?? ""}`}
                >
                    <AuthorAvatarWrapper>
                        {author.avatarImage ? (
                            <img
                                src={`${MEDIA_URL}/images-bucket/${author.avatarImage}`}
                                alt={`Аватар автора ${author.name}`}
                            />
                        ) : (
                            author.name.slice(0, 1).toUpperCase()
                        )}
                    </AuthorAvatarWrapper>
                    <AuthorBannerContentWrapper>
                        <AuthorBannerTopRow>
                            <AuthorBannerTitleWrapper>{author.name}</AuthorBannerTitleWrapper>
                            <AuthorBannerActions>
                                {isModerator ? (
                                    <ModeratorEditButton
                                        href={buildBrandCatalogEditHref(authorId)}
                                        label="Редактировать бренд"
                                        variant="on-dark"
                                    />
                                ) : null}
                                <AuthorLikeButton
                                    type="button"
                                    $active={Boolean(isFavourite)}
                                    onClick={setFavourite}
                                    aria-label="Добавить или удалить автора из избранного"
                                >
                                    <Heart
                                        fill={isFavourite ? "#fff" : "none"}
                                        stroke="#fff"
                                        strokeWidth={2}
                                    />
                                </AuthorLikeButton>
                            </AuthorBannerActions>
                        </AuthorBannerTopRow>
                        <AuthorBannerDescriptionWrapper>{author.description}</AuthorBannerDescriptionWrapper>
                    </AuthorBannerContentWrapper>
                </AuthorBannerWrapper>
                <ProductsSection>
                    {products.length > 0 ? (
                        <ItemList
                            title={`Полка ${author.name}`}
                            items={products}
                            renderItem={(product) => <ProductCard product={product} />}
                            layout="grid"
                            gridVariant="catalog"
                        />
                    ) : (
                        <EmptyStateWrapper>У этого автора пока нет товаров.</EmptyStateWrapper>
                    )}
                </ProductsSection>
            </MainWrapper>
        </PageRoot>
    );
};
