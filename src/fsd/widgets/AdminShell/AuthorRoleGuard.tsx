"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import styled from "styled-components";

import { useAuth } from "@entities/auth";

const Message = styled.p`
    margin: 0;
    font-size: 15px;
    color: var(--cart-summary-text-color, #666);
`;

type AuthorRoleGuardProps = {
    children: ReactNode;
};

export function AuthorRoleGuard({ children }: AuthorRoleGuardProps) {
    const router = useRouter();
    const { isAuthenticated, loading, role } = useAuth();

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            // router.replace("/auth");
            return;
        }

        if (role !== "AUTHOR") {
            router.replace("/");
        }
    }, [isAuthenticated, loading, role, router]);

    if (loading) {
        return <Message>Загрузка кабинета…</Message>;
    }

    if (!isAuthenticated || role !== "AUTHOR") {
        return null;
    }

    return <>{children}</>;
}
