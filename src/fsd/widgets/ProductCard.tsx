"use client";

import styled from "styled-components";
import Link from "next/link";

import { ProductLikeButton } from "@shared/ui/buttons";
import { Author, favouriteService, Product } from "@entities";
import { priceFormatter, truncateText } from "@shared/formatters";
import { useFavouriteProduct } from "../entities/favourite/hooks";
import { MEDIA_URL } from "../shared/api/interceptors";

const PRODUCT_NAME_MAX_LENGTH = 18;

const ProductCardStyles = styled(Link)`
    background-color: var(--product-card-bg);
    color: var(--color-text-primary);
    text-decoration: none;
    box-shadow: var(--product-card-shadow);
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
        box-shadow: var(--product-card-shadow-hover);
        transform: translateY(-2px);
    }
`;

const ProductName = styled.h4`
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
`;

export interface ProductCardProps {
    product: Product,
    author?: Author,
}


export const ProductCard = ({ product, author }: ProductCardProps) => {
    const { isFavourite, setFavourite } = useFavouriteProduct(product.id);

    // const handleClick = (event: React.MouseEvent<HTMLHeadingElement>) => {
    //     event.preventDefault();
    //     router.push(`/author/${author?.id}`);
    // }

    return (
        <ProductCardStyles href={`/product/${product.id}`} className="b-rad-14 flex-c cur-p indent-box int-10">
            <div className="image-box b-rad-10">
                <img src={`${MEDIA_URL}/images-bucket/${product.images[0]}`} />
            </div>
            <div className="flex-c">
                <div className="flex-r jc-sb ai-c">
                    <h2 className="mcf">{priceFormatter(product.price)}</h2>
                    <ProductLikeButton
                        active={isFavourite ? true : false}
                        onClick={setFavourite}
                    />
                </div>
                <div>
                    <ProductName title={product.name}>
                        {truncateText(product.name, PRODUCT_NAME_MAX_LENGTH)}
                    </ProductName>
                </div>
                {author ? (
                    <div>
                        <Link href={`/author/${author.id}`}><h5 className="span-link">{author.name}</h5></Link>
                    </div>
                ) : null}
            </div>
        </ProductCardStyles>
    )
}
export default ProductCard
