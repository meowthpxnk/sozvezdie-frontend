"use client";

import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type MouseEvent as ReactMouseEvent,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { flushSync } from "react-dom";
import styled, { keyframes } from "styled-components";
import { NewProductsMarquee, ProductList } from "@/src/main_pages/product-list";
import { Header } from "@/src/main_pages/headder";
import { AUTHORS_WITH_PRODUCTS, BANNERS } from "@/src/shared/mocks/products";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { animate, motion, useMotionValue } from "framer-motion";

const MainWrapper = styled.div`
    padding: 20px;
`;

const SectionWrapper = styled.section`
    margin-bottom: 28px;
`;

const BannerSectionWrapper = styled.section`
    margin-bottom: 28px;
`;

const BannerFrame = styled.div`
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    touch-action: pan-y;
`;

const BannerSlide = styled(Link)`
    position: relative;
    flex-shrink: 0;
    display: block;
    aspect-ratio: 16 / 7;
    background: #e9edf5;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const BannerSlideTextBlock = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 12px 20px 14px 16px;
    pointer-events: none;
    overflow: visible;
    background: linear-gradient(
        to top,
        rgba(9, 14, 24, 0.78) 0%,
        rgba(9, 14, 24, 0.22) 62%,
        transparent 100%
    );
`;

const BannerSlideTitle = styled.p`
    margin: 0;
    font-size: clamp(14px, 2.6vw, 20px);
    font-weight: 700;
    line-height: 1.28;
    letter-spacing: -0.02em;
    color: #fff;
    overflow: visible;
    /* короткая тень — длинный blur обрезался у края узкого shrink-wrap блока */
    text-shadow:
        0 1px 2px rgba(0, 0, 0, 0.65),
        0 0 1px rgba(0, 0, 0, 0.4);
`;

const BannerNavButton = styled.button<{ $left?: boolean }>`
    position: absolute;
    top: 50%;
    ${({ $left }) => ($left ? "left: 10px;" : "right: 10px;")}
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 0;
    background: rgba(9, 14, 24, 0.58);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;

    &:hover {
        background: rgba(9, 14, 24, 0.72);
    }

    svg {
        width: 15px;
        height: 15px;
    }
`;

const BannerDots = styled.div`
    position: absolute;
    left: 50%;
    top: 12px;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    pointer-events: auto;
`;

const BannerDot = styled.button<{ $active: boolean }>`
    width: 7px;
    height: 7px;
    min-width: 7px;
    border-radius: 999px;
    border: 0;
    padding: 0;
    cursor: pointer;
    background: ${({ $active }) => ($active ? "#fff" : "rgba(255, 255, 255, 0.38)")};
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
    transform: scale(${({ $active }) => ($active ? 1.2 : 1)});
    transition: transform 0.2s ease, background-color 0.2s ease;
`;

const BANNER_TIMER_RADIUS = 9;
const BANNER_TIMER_STROKE_LEN = 2 * Math.PI * BANNER_TIMER_RADIUS;

const bannerTimerStrokeFill = keyframes`
    from {
        stroke-dashoffset: ${BANNER_TIMER_STROKE_LEN};
    }
    to {
        stroke-dashoffset: 0;
    }
`;

const BannerAutoTimerRing = styled.div<{ $durationMs: number; $paused: boolean }>`
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 2;
    width: 22px;
    height: 22px;
    pointer-events: none;

    svg {
        display: block;
    }

    circle.track {
        fill: none;
        stroke: rgba(255, 255, 255, 0.32);
        stroke-width: 2;
    }

    circle.progress {
        fill: none;
        stroke: rgba(255, 255, 255, 0.95);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-dasharray: ${BANNER_TIMER_STROKE_LEN};
        stroke-dashoffset: ${BANNER_TIMER_STROKE_LEN};
        animation-name: ${bannerTimerStrokeFill};
        animation-duration: ${({ $durationMs }) => $durationMs}ms;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-play-state: ${({ $paused }) => ($paused ? "paused" : "running")};
    }
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

const BANNER_AUTO_ADVANCE_MS = 5000;

export default function HomePage() {
    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const [frameWidth, setFrameWidth] = useState(0);
    const [bannerTimerPaused, setBannerTimerPaused] = useState(false);
    const frameRef = useRef<HTMLDivElement | null>(null);
    const frameWidthRef = useRef(0);
    const animatingRef = useRef(false);
    const dragPointerIdRef = useRef<number | null>(null);
    const dragStartClientXRef = useRef(0);
    const dragStartXRef = useRef(0);
    const dragMovedRef = useRef(false);
    const suppressBannerLinkClickRef = useRef(false);
    const x = useMotionValue(0);
    const hasMultipleBanners = BANNERS.length > 1;
    const getWrappedBannerIndex = (index: number) =>
        (index + BANNERS.length) % BANNERS.length;
    const bannerWindowIndexes = [
        getWrappedBannerIndex(activeBannerIndex - 1),
        getWrappedBannerIndex(activeBannerIndex),
        getWrappedBannerIndex(activeBannerIndex + 1),
    ];

    useLayoutEffect(() => {
        const el = frameRef.current;
        if (!el) {
            return;
        }

        const syncWidth = () => {
            const w = el.clientWidth;
            frameWidthRef.current = w;
            setFrameWidth(w);
            if (w > 0 && !animatingRef.current && dragPointerIdRef.current === null) {
                x.set(-w);
            }
        };

        syncWidth();
        const observer = new ResizeObserver(syncWidth);
        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const sync = () => {
            setBannerTimerPaused(typeof document !== "undefined" && document.hidden);
        };
        sync();
        document.addEventListener("visibilitychange", sync);
        return () => {
            document.removeEventListener("visibilitychange", sync);
        };
    }, []);

    const snapTrackToCenter = () => {
        const w = frameWidthRef.current;
        if (w > 0) {
            x.set(-w);
        }
    };

    const runSlideNext = async () => {
        const w = frameWidthRef.current;
        if (!hasMultipleBanners || w <= 0 || animatingRef.current) {
            return;
        }
        animatingRef.current = true;
        try {
            await animate(x, -2 * w, { duration: 0.28, ease: "easeOut" });
            flushSync(() => {
                setActiveBannerIndex((prev) => getWrappedBannerIndex(prev + 1));
            });
            snapTrackToCenter();
        } finally {
            animatingRef.current = false;
        }
    };

    const runSlidePrev = async () => {
        const w = frameWidthRef.current;
        if (!hasMultipleBanners || w <= 0 || animatingRef.current) {
            return;
        }
        animatingRef.current = true;
        try {
            await animate(x, 0, { duration: 0.28, ease: "easeOut" });
            flushSync(() => {
                setActiveBannerIndex((prev) => getWrappedBannerIndex(prev - 1));
            });
            snapTrackToCenter();
        } finally {
            animatingRef.current = false;
        }
    };

    useEffect(() => {
        if (!hasMultipleBanners) {
            return;
        }

        const id = window.setInterval(() => {
            if (typeof document !== "undefined" && document.hidden) {
                return;
            }
            if (dragPointerIdRef.current !== null) {
                return;
            }
            void runSlideNext();
        }, BANNER_AUTO_ADVANCE_MS);

        return () => {
            window.clearInterval(id);
        };
    }, [hasMultipleBanners, activeBannerIndex]);

    const onPrevBanner = () => {
        void runSlidePrev();
    };

    const onNextBanner = () => {
        void runSlideNext();
    };

    const releaseBannerPointerIfNeeded = (event: ReactPointerEvent<HTMLDivElement>) => {
        const el = frameRef.current;
        if (el?.hasPointerCapture(event.pointerId)) {
            el.releasePointerCapture(event.pointerId);
        }
    };

    const onBannerSlideClickCapture = (event: ReactMouseEvent<HTMLAnchorElement>) => {
        if (suppressBannerLinkClickRef.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressBannerLinkClickRef.current = false;
        }
    };

    const onBannerPointerDownCapture = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }
        if (!hasMultipleBanners || animatingRef.current || frameWidthRef.current <= 0) {
            return;
        }
        if ((event.target as HTMLElement).closest("button")) {
            return;
        }

        dragPointerIdRef.current = event.pointerId;
        dragStartClientXRef.current = event.clientX;
        dragStartXRef.current = x.get();
        dragMovedRef.current = false;

        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            dragPointerIdRef.current = null;
        }
    };

    const onBannerPointerMoveCapture = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragPointerIdRef.current !== event.pointerId) {
            return;
        }
        const w = frameWidthRef.current;
        if (w <= 0) {
            return;
        }

        const dx = event.clientX - dragStartClientXRef.current;
        if (Math.abs(dx) > 6) {
            dragMovedRef.current = true;
        }

        const next = dragStartXRef.current + dx;
        const clamped = Math.min(0, Math.max(-2 * w, next));
        x.set(clamped);
    };

    const finishBannerPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragPointerIdRef.current !== event.pointerId) {
            return;
        }

        releaseBannerPointerIfNeeded(event);
        dragPointerIdRef.current = null;

        if (!hasMultipleBanners || animatingRef.current) {
            dragMovedRef.current = false;
            return;
        }

        const w = frameWidthRef.current;
        if (w <= 0) {
            dragMovedRef.current = false;
            return;
        }

        const moved = dragMovedRef.current;
        dragMovedRef.current = false;

        const rest = -w;
        const cur = x.get();
        const offset = cur - rest;
        const commitThreshold = Math.max(48, w * 0.15);

        if (!moved && Math.abs(offset) < 3) {
            return;
        }

        if (moved) {
            suppressBannerLinkClickRef.current = true;
            window.setTimeout(() => {
                suppressBannerLinkClickRef.current = false;
            }, 400);
        }

        if (offset < -commitThreshold) {
            void runSlideNext();
            return;
        }

        if (offset > commitThreshold) {
            void runSlidePrev();
            return;
        }

        animatingRef.current = true;
        void (async () => {
            try {
                await animate(x, rest, { duration: 0.22, ease: "easeOut" });
            } finally {
                animatingRef.current = false;
            }
        })();
    };

    return <div>
        <Header />
        <MainWrapper>
            <BannerSectionWrapper>
                <BannerFrame
                    ref={frameRef}
                    onPointerDownCapture={onBannerPointerDownCapture}
                    onPointerMoveCapture={onBannerPointerMoveCapture}
                    onPointerUpCapture={finishBannerPointer}
                    onPointerCancelCapture={finishBannerPointer}
                >
                    <motion.div
                        style={{
                            x,
                            display: "flex",
                            width: frameWidth > 0 ? frameWidth * 3 : "300%",
                        }}
                    >
                        {bannerWindowIndexes.map((bannerIndex, windowIndex) => {
                            const banner = BANNERS[bannerIndex];
                            return (
                                <BannerSlide
                                    href={banner.href}
                                    key={`${banner.id}-${activeBannerIndex}-${windowIndex}`}
                                    style={{ width: frameWidth > 0 ? frameWidth : "33.3333%" }}
                                    onClickCapture={onBannerSlideClickCapture}
                                    aria-label={`${banner.titleText}. ${banner.imageAlt}`}
                                >
                                    <img src={banner.imageSrc} alt="" draggable={false} />
                                    <BannerSlideTextBlock>
                                        <BannerSlideTitle>{banner.titleText}</BannerSlideTitle>
                                    </BannerSlideTextBlock>
                                </BannerSlide>
                            );
                        })}
                    </motion.div>
                    {hasMultipleBanners ? (
                        <>
                            <BannerDots>
                                {BANNERS.map((banner, index) => (
                                    <BannerDot
                                        key={`${banner.id}-dot`}
                                        type="button"
                                        $active={index === activeBannerIndex}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            if (animatingRef.current) {
                                                return;
                                            }
                                            setActiveBannerIndex(index);
                                            snapTrackToCenter();
                                        }}
                                        aria-label={`Перейти к баннеру ${index + 1}`}
                                    />
                                ))}
                            </BannerDots>
                            <BannerNavButton
                                $left
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onPrevBanner();
                                }}
                                aria-label="Предыдущий баннер"
                            >
                                <ChevronLeft />
                            </BannerNavButton>
                            <BannerNavButton
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onNextBanner();
                                }}
                                aria-label="Следующий баннер"
                            >
                                <ChevronRight />
                            </BannerNavButton>
                            <BannerAutoTimerRing
                                key={activeBannerIndex}
                                $durationMs={BANNER_AUTO_ADVANCE_MS}
                                $paused={bannerTimerPaused}
                                aria-hidden
                            >
                                <svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true">
                                    <circle className="track" cx="11" cy="11" r={BANNER_TIMER_RADIUS} />
                                    <g transform="rotate(-90 11 11)">
                                        <circle
                                            className="progress"
                                            cx="11"
                                            cy="11"
                                            r={BANNER_TIMER_RADIUS}
                                        />
                                    </g>
                                </svg>
                            </BannerAutoTimerRing>
                        </>
                    ) : null}
                </BannerFrame>
            </BannerSectionWrapper>
            <SectionWrapper>
                <SectionHeader>
                    <SectionTitle>Новые товары</SectionTitle>
                    <ShowAllButton href="/products">Показать все</ShowAllButton>
                </SectionHeader>
                <NewProductsMarquee />
            </SectionWrapper>
            <SectionWrapper>
                <SectionHeader>
                    <SectionTitle>Популярные товары</SectionTitle>
                    <ShowAllButton href="/products">Показать все</ShowAllButton>
                </SectionHeader>
                <ProductList />
            </SectionWrapper>
            <SectionWrapper>
                <SectionHeader>
                    <SectionTitle>Популярные авторы</SectionTitle>
                    <ShowAllButton href="/authors">Показать все</ShowAllButton>
                </SectionHeader>
                <AuthorsListWrapper>
                    {AUTHORS_WITH_PRODUCTS.map((author) => (
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
            </SectionWrapper>
        </MainWrapper >;
    </div>

}
