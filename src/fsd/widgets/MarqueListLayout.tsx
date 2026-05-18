import styled from "styled-components";

export interface MarqueListLayoutProps {
    children: React.ReactNode;
}

const MarqueListLayoutStyles = styled.div`
    box-sizing: border-box;
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;

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
    padding-bottom: 16px;

    @media (min-width: 960px) {
        margin-inline: 0;
        scroll-padding-inline: 0;
        padding-bottom: 12px;
    }
    scrollbar-width: thin;
    scrollbar-gutter: stable;
    scrollbar-color: rgba(79, 131, 227, 0.5) rgba(9, 14, 24, 0.08);

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        border-radius: 999px;
        background: rgba(9, 14, 24, 0.06);
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 999px;
        background: rgba(79, 131, 227, 0.45);
    }
`;

const MarqueeTrack = styled.ul`
    display: flex;
    gap: 16px;
    width: max-content;

    li {
        flex: 0 0 min(46vw, 200px);
        width: min(46vw, 200px);
        min-width: 0;
        scroll-snap-align: start;
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
