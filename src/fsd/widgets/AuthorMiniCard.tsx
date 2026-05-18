"use client";

import styled from "styled-components";
import Link from "next/link";

import { Author } from "@entities";
import { AuthorAvatarImage } from "@features";
import { ProductLikeButton } from "@shared/ui/buttons";
import { useFavouriteAuthor } from "../entities/favourite/hooks";

const AuthorMiniCardStyles = styled.div`
    background-color: var(--author-mini-card-bg);
`;

const AuthorLink = styled(Link)`
    flex: 1;
    min-width: 0;
    text-decoration: none;
    color: inherit;
    gap: 8px;
`;

export interface AuthorMiniCardProps {
    author: Author;
}

export const AuthorMiniCard = ({ author }: AuthorMiniCardProps) => {
    const { isFavourite, setFavourite } = useFavouriteAuthor(author.id);

    return (
        <AuthorMiniCardStyles className="flex-r ai-c jc-sb int-14 indent-box b-rad-14">
            <AuthorLink href={`/author/${author.id}`} className="flex-r ai-c int-14">
                <AuthorAvatarImage author={author} />
                <h3>{author.name}</h3>
            </AuthorLink>
            <ProductLikeButton
                active={Boolean(isFavourite)}
                onClick={setFavourite}
            />
        </AuthorMiniCardStyles>
    );
};

export default AuthorMiniCard;
