"use client";

import styled from "styled-components";
import { useState } from "react";
import { ImageLightbox } from "@widgets";
import { MEDIA_URL } from "@shared/api/interceptors";

const PRODUCT_SPLIT_BP = 581;
const TABLET_MAIN_IMAGE_SIZE = 260;
const TABLET_THUMB_SIZE = 64;
const DESKTOP_MAIN_IMAGE_SIZE = 400;
const DESKTOP_THUMB_SIZE = 84;

const ImageGalleryStyles = styled.div`
    display: grid;
    gap: 10px;
    grid-template-areas:
        "main"
        "thumbs";
    min-width: 0;
    width: 100%;

    @media (min-width: ${PRODUCT_SPLIT_BP}px) {
        width: auto;
        grid-template-columns: ${TABLET_THUMB_SIZE + 8}px minmax(0, 1fr);
        grid-template-areas: "thumbs main";
        gap: 10px;
        align-items: start;
    }

    @media (min-width: 960px) {
        grid-template-columns: ${DESKTOP_THUMB_SIZE + 8}px minmax(0, 1fr);
        gap: 12px;
    }
`;

export interface ImageGalleryProps {
    images: string[];
}

const ProductImageContainer = styled.button`
    grid-area: main;
    background-color: var(--product-thumb-bg);
    aspect-ratio: 1 / 1;
    border: none;
    padding: 0;
    width: 100%;
    max-width: 100%;

    img[src="none"] {
        visibility: hidden;
    }

    @media (min-width: ${PRODUCT_SPLIT_BP}px) {
        width: ${TABLET_MAIN_IMAGE_SIZE}px;
        max-width: 100%;
        justify-self: start;
    }

    @media (min-width: 960px) {
        width: ${DESKTOP_MAIN_IMAGE_SIZE}px;
    }
`;

const ProductImageThumbListStyles = styled.div`
    grid-area: thumbs;
    display: flex;
    flex-direction: row;
    gap: 6px;
    overflow-x: auto;

    @media (min-width: ${PRODUCT_SPLIT_BP}px) {
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: ${TABLET_MAIN_IMAGE_SIZE}px;
        scrollbar-width: thin;
    }

    @media (min-width: 960px) {
        max-height: ${DESKTOP_MAIN_IMAGE_SIZE}px;
    }
`;

interface ProductImageThumbListProps {
    images: string[];
    activeImageIndex: number;
    onActiveImageChange: (index: number) => void;
}

interface ProductImageThumbProps {
    image: string;
    active: boolean;
    onClick: () => void;
}

const ProductImageThumbStyles = styled.button<{ $active: boolean }>`
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border: none;
    padding: 0;
    background: var(--product-thumb-bg);

    @media (min-width: ${PRODUCT_SPLIT_BP}px) {
        width: ${TABLET_THUMB_SIZE}px;
        height: ${TABLET_THUMB_SIZE}px;
    }

    @media (min-width: 960px) {
        width: ${DESKTOP_THUMB_SIZE}px;
        height: ${DESKTOP_THUMB_SIZE}px;
    }

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        border: ${({ $active }) => ($active ? "2px" : "0")} solid var(--main-color);
        border-radius: inherit;
    }
`;

const ProductImageThumb = ({ image, active, onClick }: ProductImageThumbProps) => {
    return <ProductImageThumbStyles
        $active={active}
        className="pos-r b-rad-10 cur-p ov-h"
        onClick={onClick}
    >
        <img className="img-cover" src={image ?? "none"} />
    </ProductImageThumbStyles >
}

const ProductImageThumbList = ({ images, activeImageIndex, onActiveImageChange }: ProductImageThumbListProps) => {
    return <ProductImageThumbListStyles>
        {images.map((image, index) => (
            <ProductImageThumb
                key={index}
                image={`${MEDIA_URL}/images-bucket/${image}`}
                active={index === activeImageIndex}
                onClick={() => onActiveImageChange(index)}
            />
        ))}
    </ProductImageThumbListStyles>
}


export const ImageGallery = ({ images }: ImageGalleryProps) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const openLightbox = () => {
        setIsLightboxOpen(true);
    }
    const closeLightbox = () => {
        setIsLightboxOpen(false);
    }
    return <>
        <ImageGalleryStyles>
            <ProductImageContainer className="b-rad-10 ov-h cur-p" onClick={openLightbox}>
                <img
                    className="img-cover"
                    src={`${MEDIA_URL}/images-bucket/${images[activeImageIndex]}`}
                />
            </ProductImageContainer>
            <ProductImageThumbList
                images={images}
                activeImageIndex={activeImageIndex}
                onActiveImageChange={setActiveImageIndex}
            />
        </ImageGalleryStyles>
        <ImageLightbox
            images={images}
            clickedImageIndex={activeImageIndex}
            isOpen={isLightboxOpen}
            onClose={closeLightbox}
        />
    </>;
}
