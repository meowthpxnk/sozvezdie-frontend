import CartTrashButton from "@shared/ui/buttons/CartTrashButton";
import CartSelectButton from "@shared/ui/buttons/CartSelectButton";
import ProductLikeButton from "@shared/ui/buttons/ProductLikeButton";
import styled, { css } from "styled-components";
import { Product } from "@entities";
import { CartQty } from "@widgets";
import { priceFormatter } from "../shared/formatters";
import { useFavouriteProduct } from "../entities/favourite/hooks";
import { useCartQuantity, useCartSelection } from "../entities/cart/hooks/index";
import Link from "next/link";
import { MEDIA_URL } from "@shared/api/interceptors";

const CartItemStyles = styled.div<{
    $outOfStock: boolean;
    $selected: boolean;
}>`
    --indentation: 12px;
    background-color: ${({ $outOfStock }) =>
        $outOfStock ? "var(--cart-out-of-stock-bg)" : "var(--color-bg-primary)"};
    transition:
        background-color 0.2s ease,
        opacity 0.2s ease,
        box-shadow 0.2s ease;
    opacity: ${({ $selected, $outOfStock }) =>
        !$selected && !$outOfStock ? 0.55 : $outOfStock ? 0.72 : 1};

    ${({ $outOfStock }) =>
        $outOfStock &&
        css`
            img {
                filter: grayscale(1);
            }

            h2,
            h3,
            h5,
            a {
                color: var(--cart-out-of-stock-color) !important;
            }
        `}
`;

const OutOfStockBadge = styled.span`
    display: inline-block;
    margin-top: 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--cart-stock-warning-color);
`;

export interface CartItemProps {
    product: Product;
    quantity: number;
}

interface CartActionsProps {
    isFavourite: boolean;
    isSelected: boolean;
    isOutOfStock: boolean;
    setFavourite: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onToggleSelect: () => void;
    setQuantity: (quantity: number) => void;
}

const CartActions = ({
    isFavourite,
    isSelected,
    isOutOfStock,
    setFavourite,
    onToggleSelect,
    setQuantity,
}: CartActionsProps) => {
    return (
        <div className="flex-r ai-c indent-list int-8">
            {!isOutOfStock ? (
                <CartSelectButton
                    active={isSelected}
                    onClick={(event) => {
                        event.preventDefault();
                        onToggleSelect();
                    }}
                />
            ) : null}
            <ProductLikeButton active={isFavourite} onClick={setFavourite} />
            <CartTrashButton onClick={() => setQuantity(0)} />
        </div>
    );
};

const ImageBoxStyles = styled.div`
    --size: 80px;
`;

export const CartItem = ({ product }: CartItemProps) => {
    const { isFavourite, setFavourite } = useFavouriteProduct(product.id);
    const { quantity, setQuantity } = useCartQuantity(product.id, {
        maxStock: product.stockCount,
    });
    const { isSelected, toggleSelected } = useCartSelection(product.id);

    const isOutOfStock = product.stockCount <= 0;
    const canIncrease = !isOutOfStock && quantity < product.stockCount;

    return (
        <CartItemStyles
            $outOfStock={isOutOfStock}
            $selected={isSelected && !isOutOfStock}
            className="flex-r jc-sb indent-box b-rad-10"
        >
            <ImageBoxStyles className="image-box size-box b-rad-10">
                <img
                    src={`${MEDIA_URL}/images-bucket/${product.images[0]}`}
                    alt={product.name}
                />
            </ImageBoxStyles>
            <div className="flex-c indent-box fg-1 int-6">
                <Link href={`/product/${product.id}`}>
                    <h3>{product.name}</h3>
                </Link>
                {isOutOfStock ? (
                    <OutOfStockBadge>Нет в наличии</OutOfStockBadge>
                ) : null}
                <CartActions
                    isFavourite={isFavourite}
                    isSelected={isSelected}
                    isOutOfStock={isOutOfStock}
                    setFavourite={setFavourite}
                    onToggleSelect={toggleSelected}
                    setQuantity={setQuantity}
                />
            </div>
            <div className="flex-c ai-fe jc-sb">
                <div className="stl-mc">
                    <h2>{priceFormatter(product.price * quantity)}</h2>
                </div>
                <div>
                    {isOutOfStock ? (
                        <h5 className="span-not-important">Закончился</h5>
                    ) : (
                        <h5 className="span-not-important">
                            В наличии: {product.stockCount} шт.
                        </h5>
                    )}
                </div>
                <CartQty
                    quantity={quantity}
                    changeQuantity={setQuantity}
                    canIncrease={canIncrease}
                />
            </div>
        </CartItemStyles>
    );
};

export default CartItem;
