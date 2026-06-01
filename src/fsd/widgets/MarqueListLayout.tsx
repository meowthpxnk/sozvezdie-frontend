import styled from "styled-components";

export interface MarqueListLayoutProps {
    children: React.ReactNode;
}

const MarqueListLayoutStyles = styled.div`
    box-sizing: border-box;
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;
    /* Запас снаружи скролла — тень карточек не режется родителем секции */
    padding-block: 8px;
    margin-block: -8px;

    @media (min-width: 960px) {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
    }
`;

const MarqueeScroll = styled.div`
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 8px;
    box-sizing: border-box;
    margin-inline: 20px;
    width: auto;
    max-width: none;
    /* Вертикальный запас, чтобы box-shadow карточек не обрезался */
    padding: 10px 0 20px;

    @media (min-width: 960px) {
        margin-inline: 0;
        scroll-padding-inline: 4px;
        padding: 10px 4px 20px;
    }
    scrollbar-width: thin;
    scrollbar-gutter: stable;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        border-radius: 999px;
        background: var(--scrollbar-track-subtle);
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 999px;
        background: var(--scrollbar-thumb-strong);
    }
`;

const MarqueeTrack = styled.ul`
    display: flex;
    gap: 16px;
    width: max-content;
    padding-block: 2px;

    li {
        flex: 0 0 min(46vw, 200px);
        width: min(46vw, 200px);
        min-width: 0;
        scroll-snap-align: start;
        overflow: visible;
        padding-inline: 2px;
        box-sizing: border-box;
    }

    @media (min-width: 960px) {
        gap: 20px;

        li {
            flex: 0 0 220px;
            width: 220px;
        }
    }
`;

export const MarqueListLayout = ({ children }: MarqueListLayoutProps) => {
    return <MarqueListLayoutStyles>
        <MarqueeScroll>
            <MarqueeTrack>
                {children}
            </MarqueeTrack>
        </MarqueeScroll>
    </MarqueListLayoutStyles>
}
export default MarqueListLayout
