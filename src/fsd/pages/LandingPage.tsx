import styled from "styled-components";

import { AdvertBanner, Author, ProductWithAuthor } from "@entities";
import { ItemList } from "@features";
import { AuthorMiniCard, LandingBanner, ProductCard } from "@widgets";

const LandingPageStyles = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;

    @media (min-width: 960px) {
        gap: 40px;
    }
`;

export interface LandingPageProps {
    recommendedProductList: ProductWithAuthor[],
    newProductList: ProductWithAuthor[]
    advertBanners?: AdvertBanner[],
    popularAuthors: Author[],
}

export const LandingPage = ({ recommendedProductList, newProductList, advertBanners, popularAuthors, }: LandingPageProps) => {
    return (
        <LandingPageStyles className="flex-c indent-list int-16">
            {advertBanners ? <LandingBanner banners={advertBanners} /> : null}
            <ItemList
                title="Новые товары"
                href="/products"
                items={newProductList}
                renderItem={(product) => <ProductCard product={product} author={product.author} />}
                layout="marquee"
            />
            <ItemList
                title="Популярные товары"
                href="/products"
                items={recommendedProductList}
                renderItem={(product) => <ProductCard product={product} author={product.author} />}
                gridVariant="catalog"
            />
            <ItemList
                title="Популярные авторы"
                href="/authors"
                items={popularAuthors}
                renderItem={(author) => <AuthorMiniCard author={author} />}
                gridVariant="authors"
            />
        </LandingPageStyles>
    );
}
export default LandingPage
