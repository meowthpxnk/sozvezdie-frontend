"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Header } from "@/src/main_pages/headder";
import { PRODUCTS_LIST } from "@/src/shared/mocks/products";
import { useCatalogStorage } from "@/src/shared/lib/catalog-storage";
import { useRouter } from "next/navigation";
import { useSellerData } from "@/src/shared/lib/use-seller-data";

const MainWrapper = styled.div`
    padding: 20px;
`;

const ProductPageCardWrapper = styled.div`
    background-color: #fff;
    border-radius: 14px;
    padding: 14px;
    color: #000;
`;

const ProductLayoutWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
`;

const ProductImageContainerWrapper = styled.div`
    background-color: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 1 / 1;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    img[src="none"] {
        visibility: hidden;
    }
`;

const ProductMainImageButton = styled.button`
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: inherit;
    padding: 0;
    background: transparent;
    cursor: zoom-in;
    display: block;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const ProductImagesRow = styled.div`
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 2px;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const ProductImageThumbButton = styled.button<{ $active: boolean }>`
    border: 0;
    border-radius: 10px;
    padding: 0;
    overflow: hidden;
    position: relative;
    width: 52px;
    height: 52px;
    min-width: 52px;
    flex-shrink: 0;
    background: #f0f0f0;
    cursor: pointer;
    transition: box-shadow 0.2s ease;

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        border: 2px solid ${({ $active }) => ($active ? "#4f83e3" : "transparent")};
        border-radius: inherit;
        pointer-events: none;
        box-sizing: border-box;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const ProductImagesScrollbar = styled.div`
    position: relative;
    width: 100%;
    height: 6px;
    background: transparent;
    margin-top: -6px;
`;

const ProductImagesScrollbarThumb = styled.div<{ $leftPercent: number; $widthPercent: number }>`
    position: absolute;
    top: 0;
    left: ${({ $leftPercent }) => `${$leftPercent}%`};
    width: ${({ $widthPercent }) => `${$widthPercent}%`};
    height: 100%;
    background: #4f83e3;
    min-width: 32px;
    cursor: pointer;
    touch-action: none;
    border-radius: 12px;
`;

const ProductInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ProductPriceWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: #4f83e3;
    font-weight: 600;
`;

const ProductPriceValue = styled.span`
    font-size: 32px;
    line-height: 1.1;
`;

const ProductStockWrapper = styled.span`
    font-size: 12px;
    line-height: 1.2;
    font-weight: 500;
    color: #5d6a7d;
    white-space: nowrap;
`;

const ProductNameWrapper = styled.h1`
    font-size: 24px;
    font-weight: 600;
    color: #111;
`;

const ProductAuthorCardButton = styled.button`
    width: 100%;
    height: 52px;
    border-radius: 12px;
    padding: 8px 10px;
    background: #f6f7f9;
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
`;

const ProductAuthorAvatarWrapper = styled.div`
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #dfe7f7;
    color: #2f5fcb;
    font-weight: 700;
    font-size: 14px;
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

const ProductAuthorInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
`;

const ProductAuthorLabelWrapper = styled.span`
    font-size: 11px;
    line-height: 1;
    color: #666;
`;

const ProductAuthorNameWrapper = styled.span`
    font-size: 14px;
    line-height: 1.1;
    font-weight: 600;
    color: #111;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ProductAuthorSectionWrapper = styled.div`
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ProductAuthorTopRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
`;

const ProductAuthorLikeButton = styled.button<{ $active: boolean }>`
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    border-radius: 12px;
    background: ${({ $active }) => ($active ? "#4f83e3" : "#e9edf5")};
    color: ${({ $active }) => ($active ? "#fff" : "#4f83e3")};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${({ $active }) => ($active ? "#3f74d6" : "#dce4f3")};
    }

    svg {
        width: 18px;
        height: 18px;
    }
`;

const ProductDescriptionWrapper = styled.p`
    font-size: 14px;
    line-height: 1.45;
    color: #444;
`;

const ProductCartRow = styled.div<{ $hasCounter: boolean }>`
    display: flex;
    align-items: center;
    gap: ${({ $hasCounter }) => ($hasCounter ? "10px" : "0")};
`;

const AddToCartButtonWrapper = styled.button<{ $active: boolean }>`
    width: 100%;
    height: 52px;
    padding: 0 16px;
    border-radius: 12px;
    background: ${({ $active }) => ($active ? "#2ea44f" : "#4f83e3")};
    color: #fff;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;

    &:hover {
        background-color: ${({ $active }) => ($active ? "#278b43" : "#3f74d6")};
    }

    svg {
        width: 16px;
        height: 16px;
    }
`;

const ProductCartCounterWrapper = styled.div<{ $visible: boolean }>`
    width: ${({ $visible }) => ($visible ? "156px" : "0")};
    height: 52px;
    border-radius: 12px;
    background: #4f83e3;
    color: #fff;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    display: flex;
    font-weight: 600;
    font-size: 16px;
    overflow: hidden;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transform: translateX(${({ $visible }) => ($visible ? "0" : "-8px")});
    transition: width 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
    pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
`;

const ProductCartCounterButton = styled.button`
    width: 52px;
    height: 52px;
    background: #4f83e3;
    color: #fff;
    font-size: 20px;
    line-height: 1;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;

    &:hover {
        background: #3f74d6;
    }
`;

const ProductCartCounterValue = styled.span`
    width: 52px;
    height: 52px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const HeartIconWrapper = styled(Heart)`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LightboxOverlay = styled(motion.div)`
    position: fixed;
    inset: 0;
    z-index: 1200;
    background: rgba(9, 14, 24, 0.57);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    overscroll-behavior: none;
`;

const LightboxContent = styled(motion.div)`
    position: relative;
    width: min(1100px, 100%);
    height: calc(100vh - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 72px 0 18px;
`;

const LightboxMediaWrapper = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    touch-action: none;
    overscroll-behavior: none;
`;

const LightboxImage = styled(motion.img)`
    width: min(760px, 100%);
    min-width: min(320px, 100%);
    max-width: 100%;
    max-height: calc(100vh - 120px);
    object-fit: contain;
    user-select: none;
    border-radius: 14px;
    touch-action: none;
`;

const LightboxDotsWrapper = styled.div<{ $width: number }>`
    width: ${({ $width }) => `${$width}px`};
    overflow: hidden;
    pointer-events: none;
`;

const LightboxDotsTrack = styled.div<{ $offset: number }>`
    display: flex;
    align-items: center;
    gap: 8px;
    transform: translateX(${({ $offset }) => `${$offset}px`});
    transition: transform 0.2s ease;
`;

const LightboxDot = styled.span<{ $active: boolean }>`
    width: 10px;
    height: 10px;
    min-width: 10px;
    border-radius: 999px;
    background: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.45)")};
    transform: scale(${({ $active }) => ($active ? 1 : 0.8)});
    transition: transform 0.2s ease, background-color 0.2s ease;
`;

const LightboxButton = styled.button`
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 0;
    background: rgba(9, 14, 24, 0.58);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background: rgba(9, 14, 24, 0.72);
    }

    svg {
        width: 14px;
        height: 14px;
    }
`;

const LightboxBottomControls = styled.div`
    width: fit-content;
    display: grid;
    grid-template-columns: 28px auto 28px;
    align-items: center;
    justify-content: center;
    gap: 14px;
    min-height: 28px;
`;

/** Must stay outside any motion/transform ancestor (e.g. LightboxContent) or `fixed` tracks that box and jerks on open. */
const LightboxCloseButton = styled.button`
    position: fixed;
    top: 16px;
    right: 16px;
    width: 52px;
    height: 52px;
    border-radius: 12px;
    border: 0;
    background: rgba(9, 14, 24, 0.58);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    z-index: 1220;
    pointer-events: auto;

    &:hover {
        background: rgba(9, 14, 24, 0.72);
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

type ProductPageProps = {
    productId?: string;
};

const lightboxImageVariants = {
    enter: (direction: 1 | -1) => ({
        opacity: 0,
        x: direction > 0 ? 60 : -60,
    }),
    center: {
        opacity: 1,
        x: 0,
    },
    exit: (direction: 1 | -1) => ({
        opacity: 0,
        x: direction > 0 ? -60 : 60,
    }),
};

export const ProductPage = ({ productId }: ProductPageProps) => {
    const router = useRouter();
    const { storefrontProducts, storefrontAuthors } = useSellerData();
    const selectedProduct = storefrontProducts.find((product) => product.id === productId) ?? storefrontProducts[0] ?? PRODUCTS_LIST[0];
    const selectedAuthor = storefrontAuthors.find((author) => author.name === selectedProduct.brandText);
    const defaultLikedIds = storefrontProducts.filter((item) => item.favourite).map((item) => item.id);
    const { isLiked, getCartQuantity, toggleLike, setCartQuantity } = useCatalogStorage(defaultLikedIds);
    const liked = isLiked(selectedProduct.id);
    const quantity = getCartQuantity(selectedProduct.id);
    const inCart = quantity > 0;
    const authorName = selectedAuthor?.name ?? selectedProduct.brandText;
    const authorAvatarFallback = authorName.slice(0, 1).toUpperCase();
    const authorAvatarImage = selectedAuthor?.avatarImageSrc;
    const productImages = useMemo(() => {
        const list = selectedProduct.images?.filter(Boolean) ?? [];
        if (list.length > 0) {
            return list;
        }
        return selectedProduct.imageSrc ? [selectedProduct.imageSrc] : [];
    }, [selectedProduct.imageSrc, selectedProduct.images]);
    const [pageActiveImageIndex, setPageActiveImageIndex] = useState(0);
    const [lightboxActiveImageIndex, setLightboxActiveImageIndex] = useState(0);
    const [lightboxDirection, setLightboxDirection] = useState<1 | -1>(1);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const imagesRowRef = useRef<HTMLDivElement | null>(null);
    const scrollbarTrackRef = useRef<HTMLDivElement | null>(null);
    const dragStateRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollMetrics, setScrollMetrics] = useState({ clientWidth: 1, scrollWidth: 1, trackWidth: 1 });

    useEffect(() => {
        setPageActiveImageIndex(0);
        setLightboxActiveImageIndex(0);
    }, [productImages]);
    const activeImage = productImages[pageActiveImageIndex] ?? "none";
    const lightboxActiveImage = productImages[lightboxActiveImageIndex] ?? "none";
    const hasMultipleImages = productImages.length > 1;
    const visibleDotsCount = Math.min(5, productImages.length);
    const dotSize = 10;
    const dotGap = 8;
    const dotStep = dotSize + dotGap;
    const maxWindowStart = Math.max(0, productImages.length - visibleDotsCount);
    const centeredStart = lightboxActiveImageIndex - Math.floor(visibleDotsCount / 2);
    const visibleStartIndex = Math.min(Math.max(centeredStart, 0), maxWindowStart);
    const dotsOffset = -(visibleStartIndex * dotStep);
    const dotsViewportWidth = visibleDotsCount * dotSize + Math.max(0, visibleDotsCount - 1) * dotGap;

    useEffect(() => {
        const node = imagesRowRef.current;
        if (!node) {
            return;
        }

        const syncMetrics = () => {
            setScrollLeft(node.scrollLeft);
            setScrollMetrics({
                clientWidth: node.clientWidth || 1,
                scrollWidth: node.scrollWidth || 1,
                trackWidth: scrollbarTrackRef.current?.clientWidth || node.clientWidth || 1,
            });
        };

        syncMetrics();
        node.addEventListener("scroll", syncMetrics);
        window.addEventListener("resize", syncMetrics);

        return () => {
            node.removeEventListener("scroll", syncMetrics);
            window.removeEventListener("resize", syncMetrics);
        };
    }, [productImages]);

    const thumbWidthPercent = Math.min(
        100,
        (scrollMetrics.clientWidth / scrollMetrics.scrollWidth) * 100
    );
    const maxScrollLeft = Math.max(0, scrollMetrics.scrollWidth - scrollMetrics.clientWidth);
    const hasHorizontalOverflow = maxScrollLeft > 0;
    const thumbLeftPercent =
        maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * (100 - thumbWidthPercent) : 0;

    const setScrollByTrackPosition = (positionX: number) => {
        const imagesNode = imagesRowRef.current;
        const trackNode = scrollbarTrackRef.current;
        if (!imagesNode || !trackNode) {
            return;
        }
        const trackRect = trackNode.getBoundingClientRect();
        const clampedX = Math.min(Math.max(positionX - trackRect.left, 0), trackRect.width);
        const thumbWidthPx = Math.max(32, (thumbWidthPercent / 100) * trackRect.width);
        const maxThumbLeft = Math.max(0, trackRect.width - thumbWidthPx);
        const targetThumbLeft = Math.min(Math.max(clampedX - thumbWidthPx / 2, 0), maxThumbLeft);
        const nextScrollLeft =
            maxThumbLeft > 0 ? (targetThumbLeft / maxThumbLeft) * maxScrollLeft : 0;
        imagesNode.scrollLeft = nextScrollLeft;
    };

    useEffect(() => {
        const onPointerMove = (event: PointerEvent) => {
            if (!dragStateRef.current.dragging) {
                return;
            }
            const imagesNode = imagesRowRef.current;
            const trackNode = scrollbarTrackRef.current;
            if (!imagesNode || !trackNode) {
                return;
            }

            const deltaX = event.clientX - dragStateRef.current.startX;
            const trackWidth = trackNode.getBoundingClientRect().width;
            const thumbWidthPx = Math.max(32, (thumbWidthPercent / 100) * trackWidth);
            const maxThumbLeft = Math.max(1, trackWidth - thumbWidthPx);
            const scrollPerPx = maxScrollLeft / maxThumbLeft;
            const nextScrollLeft = dragStateRef.current.startScrollLeft + deltaX * scrollPerPx;
            imagesNode.scrollLeft = Math.min(Math.max(nextScrollLeft, 0), maxScrollLeft);
        };

        const onPointerUp = () => {
            dragStateRef.current.dragging = false;
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);

        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
        };
    }, [maxScrollLeft, thumbWidthPercent]);

    const onCartToggle = () => {
        setCartQuantity(selectedProduct.id, inCart ? 0 : 1);
    };

    const onLikeToggle = () => {
        toggleLike(selectedProduct.id);
    };

    const onIncreaseQty = () => {
        setCartQuantity(selectedProduct.id, quantity + 1);
    };

    const onDecreaseQty = () => {
        setCartQuantity(selectedProduct.id, Math.max(0, quantity - 1));
    };

    const onAuthorClick = () => {
        if (!selectedAuthor) {
            return;
        }
        router.push(`/authors/${selectedAuthor.id}`);
    };

    const onPrevImage = () => {
        if (!hasMultipleImages) {
            return;
        }
        setLightboxDirection(-1);
        setLightboxActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    };

    const onNextImage = () => {
        if (!hasMultipleImages) {
            return;
        }
        setLightboxDirection(1);
        setLightboxActiveImageIndex((prev) => (prev + 1) % productImages.length);
    };

    const onLightboxDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (!hasMultipleImages) {
            return;
        }

        const offsetThreshold = 60;
        const velocityThreshold = 500;
        const offsetX = info.offset.x;
        const velocityX = info.velocity.x;

        // First rely on actual drag distance. Velocity fallback is used
        // only for short but fast flicks to avoid opposite-direction glitches.
        if (offsetX <= -offsetThreshold) {
            onNextImage();
            return;
        }

        if (offsetX >= offsetThreshold) {
            onPrevImage();
            return;
        }

        if (velocityX <= -velocityThreshold) {
            onNextImage();
            return;
        }

        if (velocityX >= velocityThreshold) {
            onPrevImage();
        }
    };

    useEffect(() => {
        if (!lightboxOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        const previousOverscrollBehavior = document.body.style.overscrollBehavior;
        document.body.style.overflow = "hidden";
        document.body.style.overscrollBehavior = "none";

        return () => {
            document.body.style.overflow = previousOverflow;
            document.body.style.overscrollBehavior = previousOverscrollBehavior;
        };
    }, [lightboxOpen]);

    useEffect(() => {
        if (!lightboxOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setLightboxOpen(false);
                return;
            }
            if (event.key === "ArrowLeft") {
                onPrevImage();
                return;
            }
            if (event.key === "ArrowRight") {
                onNextImage();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [lightboxOpen, productImages.length]);

    return (
        <>
            <Header />
            <MainWrapper>
                <ProductPageCardWrapper>
                    <ProductLayoutWrapper>
                        <ProductImageContainerWrapper>
                            <ProductMainImageButton
                                type="button"
                                onClick={() => {
                                    setLightboxActiveImageIndex(pageActiveImageIndex);
                                    setLightboxOpen(true);
                                }}
                                aria-label="Открыть изображение в полном размере"
                            >
                                <img
                                    src={activeImage}
                                    alt={selectedProduct.imageAlt ?? selectedProduct.nameText}
                                />
                            </ProductMainImageButton>
                        </ProductImageContainerWrapper>
                        {productImages.length > 1 ? (
                            <>
                                <ProductImagesRow ref={imagesRowRef}>
                                    {productImages.map((image, index) => (
                                        <ProductImageThumbButton
                                            key={`${selectedProduct.id}-thumb-${index}`}
                                            type="button"
                                            $active={index === pageActiveImageIndex}
                                            onClick={() => {
                                                setPageActiveImageIndex(index);
                                            }}
                                            aria-label={`Показать изображение ${index + 1}`}
                                        >
                                            <img src={image} alt={`${selectedProduct.nameText} ${index + 1}`} />
                                        </ProductImageThumbButton>
                                    ))}
                                </ProductImagesRow>
                                {hasHorizontalOverflow ? (
                                    <ProductImagesScrollbar
                                        ref={scrollbarTrackRef}
                                        onPointerDown={(event) => {
                                            const target = event.target as HTMLElement;
                                            if (target !== event.currentTarget) {
                                                return;
                                            }
                                            setScrollByTrackPosition(event.clientX);
                                        }}
                                    >
                                        <ProductImagesScrollbarThumb
                                            $leftPercent={thumbLeftPercent}
                                            $widthPercent={thumbWidthPercent}
                                            onPointerDown={(event) => {
                                                event.preventDefault();
                                                dragStateRef.current = {
                                                    dragging: true,
                                                    startX: event.clientX,
                                                    startScrollLeft: scrollLeft,
                                                };
                                            }}
                                        />
                                    </ProductImagesScrollbar>
                                ) : null}
                            </>
                        ) : null}

                        <ProductInfoWrapper>
                            <ProductPriceWrapper>
                                <ProductPriceValue>{selectedProduct.priceText}</ProductPriceValue>
                                <ProductStockWrapper>В наличии: {selectedProduct.stockCount} шт.</ProductStockWrapper>
                            </ProductPriceWrapper>

                            <ProductNameWrapper>{selectedProduct.nameText}</ProductNameWrapper>

                            <ProductDescriptionWrapper>
                                Статичная страница товара для MVP просмотра. Здесь только
                                визуальная часть без интерактивной логики и бизнес-обработчиков.
                            </ProductDescriptionWrapper>

                        </ProductInfoWrapper>
                    </ProductLayoutWrapper>
                    <ProductAuthorSectionWrapper>
                        <ProductAuthorTopRow>
                            <ProductAuthorCardButton
                                type="button"
                                onClick={onAuthorClick}
                                aria-label={`Перейти к автору ${authorName}`}
                            >
                                <ProductAuthorAvatarWrapper>
                                    {authorAvatarImage ? (
                                        <img src={authorAvatarImage} alt={`Аватар автора ${authorName}`} />
                                    ) : (
                                        authorAvatarFallback
                                    )}
                                </ProductAuthorAvatarWrapper>
                                <ProductAuthorInfoWrapper>
                                    <ProductAuthorLabelWrapper>Автор товара</ProductAuthorLabelWrapper>
                                    <ProductAuthorNameWrapper>{authorName}</ProductAuthorNameWrapper>
                                </ProductAuthorInfoWrapper>
                            </ProductAuthorCardButton>
                            <ProductAuthorLikeButton
                                $active={liked}
                                type="button"
                                onClick={onLikeToggle}
                                aria-label="Добавить или удалить из избранного"
                            >
                                <HeartIconWrapper fill={liked ? "#fff" : "none"} stroke={liked ? "#fff" : "#4f83e3"} strokeWidth={2} />
                            </ProductAuthorLikeButton>
                        </ProductAuthorTopRow>
                        <ProductCartRow $hasCounter={inCart}>
                            <AddToCartButtonWrapper
                                $active={inCart}
                                type="button"
                                onClick={onCartToggle}
                                aria-label="Добавить или удалить товар из корзины"
                            >
                                <ShoppingCart stroke="#fff" strokeWidth={2} />
                                {inCart ? "В корзине" : "В корзину"}
                            </AddToCartButtonWrapper>
                            <ProductCartCounterWrapper $visible={inCart} aria-hidden={!inCart}>
                                <ProductCartCounterButton type="button" aria-label="Уменьшить количество" onClick={onDecreaseQty}>
                                    -
                                </ProductCartCounterButton>
                                <ProductCartCounterValue>{quantity}</ProductCartCounterValue>
                                <ProductCartCounterButton type="button" aria-label="Увеличить количество" onClick={onIncreaseQty}>
                                    +
                                </ProductCartCounterButton>
                            </ProductCartCounterWrapper>
                        </ProductCartRow>
                    </ProductAuthorSectionWrapper>
                </ProductPageCardWrapper>
            </MainWrapper>
            <AnimatePresence>
                {lightboxOpen ? (
                    <LightboxOverlay
                        role="dialog"
                        aria-modal="true"
                        aria-label="Просмотр изображений товара"
                        onClick={() => setLightboxOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <LightboxContent
                            onClick={(event) => event.stopPropagation()}
                            initial={{ opacity: 0, y: 14, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.985 }}
                            transition={{ duration: 0.24, ease: "easeOut" }}
                        >
                            <LightboxMediaWrapper onClick={() => setLightboxOpen(false)}>
                                <AnimatePresence mode="wait" initial={false} custom={lightboxDirection}>
                                    <LightboxImage
                                        key={`${selectedProduct.id}-lightbox-${lightboxActiveImageIndex}`}
                                        src={lightboxActiveImage}
                                        alt={selectedProduct.imageAlt ?? selectedProduct.nameText}
                                        onClick={(event) => event.stopPropagation()}
                                        drag={hasMultipleImages ? "x" : false}
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.16}
                                        onDragEnd={onLightboxDragEnd}
                                        whileDrag={{ scale: 0.985 }}
                                        variants={lightboxImageVariants}
                                        custom={lightboxDirection}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.26, ease: "easeOut" }}
                                    />
                                </AnimatePresence>
                            </LightboxMediaWrapper>
                            {hasMultipleImages ? (
                                <LightboxBottomControls>
                                    <LightboxButton
                                        type="button"
                                        aria-label="Предыдущее изображение"
                                        onClick={onPrevImage}
                                    >
                                        <ChevronLeft />
                                    </LightboxButton>
                                    <LightboxDotsWrapper $width={dotsViewportWidth} aria-hidden="true">
                                        <LightboxDotsTrack $offset={dotsOffset}>
                                            {productImages.map((_, index) => (
                                                <LightboxDot
                                                    key={`${selectedProduct.id}-lightbox-dot-${index}`}
                                                    $active={index === lightboxActiveImageIndex}
                                                />
                                            ))}
                                        </LightboxDotsTrack>
                                    </LightboxDotsWrapper>
                                    <LightboxButton
                                        type="button"
                                        aria-label="Следующее изображение"
                                        onClick={onNextImage}
                                    >
                                        <ChevronRight />
                                    </LightboxButton>
                                </LightboxBottomControls>
                            ) : null}
                        </LightboxContent>
                    </LightboxOverlay>
                ) : null}
            </AnimatePresence>
            {lightboxOpen ? (
                <LightboxCloseButton
                    type="button"
                    aria-label="Закрыть просмотр"
                    onClick={(event) => {
                        event.stopPropagation();
                        setLightboxOpen(false);
                    }}
                >
                    <X />
                </LightboxCloseButton>
            ) : null}
        </>
    );
};
