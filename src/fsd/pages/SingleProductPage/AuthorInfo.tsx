import { AuthorInfoLikeButton } from "@shared/ui/buttons";
import { Author } from "@entities";
import styled from "styled-components";
import { MEDIA_URL } from "@shared/api/interceptors";

const AuthorInfoStyles = styled.div`
    width: 100%;
    height: 52px;

    @media (min-width: 1200px) {
        height: 100%;
        min-height: 52px;
    }
`;

export interface AuthorInfoProps {
    author: Pick<Author, "id" | "name" | "avatarImage">;
    isFavourite: boolean;
    setFavourite: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AuthorCardButton = styled.div`
    padding: 8px 10px;
    background: var(--product-author-card-bg);
    text-align: left;
    height: 100%;
    min-height: 52px;
    border-radius: 8px 0 0 8px;
    flex: 1;
    min-width: 0;
`;

const AuthorAvatar = styled.div`
    background: var(--product-author-avatar-bg);
    color: var(--product-author-avatar-fg);
    height: 100%;
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
    --size: 40px;
`;

const AuthorInfoContent = styled.div`
    min-width: 0;
`;

const AuthorLikeButton = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: stretch;
    background: var(--product-author-like-button-bg);
    color: var(--product-author-like-button-fg);
    border-radius: 0 8px 8px 0;
    overflow: hidden;
`;

export const AuthorInfo = ({ author, isFavourite, setFavourite }: AuthorInfoProps) => {
    const { name, avatarImage } = author;
    return (
        <AuthorInfoStyles className="flex-r ai-c cur-p">
            <AuthorCardButton className="flex-r ai-c indent-list int-8">
                <AuthorAvatar className="b-rad-10 size-box flex-center shrink-0 ov-h">
                    {author.avatarImage ? (
                        <img src={`${MEDIA_URL}/images-bucket/${avatarImage}`} />
                    ) : <h3>{name.slice(0, 1).toUpperCase()}</h3>}
                </AuthorAvatar>
                <AuthorInfoContent className="flex-c ov-h">
                    <span className="span-not-important text-caption">Автор товара</span>
                    <h5 className="truncate fw-600">{name}</h5>
                </AuthorInfoContent>
            </AuthorCardButton>
            <AuthorLikeButton>
                <AuthorInfoLikeButton
                    active={isFavourite}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setFavourite(event);
                    }}
                />
            </AuthorLikeButton>
        </AuthorInfoStyles>
    );
}
