"use client";

import styled from "styled-components";
import { Header } from "@/src/main_pages/headder";

const Main = styled.main`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Title = styled.h1`
    margin: 0;
    font-size: 28px;
    color: var(--color);
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`;

type AdminShellProps = {
    title: string;
    children: React.ReactNode;
    hideTabs?: boolean;
    titleRight?: React.ReactNode;
};

export const AdminShell = ({ title, children, hideTabs = false, titleRight }: AdminShellProps) => {
    return (
        <div>
            <Header hideSearch />
            <Main>
                <TitleRow>
                    <Title>{title}</Title>
                    {titleRight}
                </TitleRow>
                {children}
            </Main>
        </div>
    );
};
