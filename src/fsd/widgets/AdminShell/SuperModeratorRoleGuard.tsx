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

type SuperModeratorRoleGuardProps = {
    children: ReactNode;
};

export function SuperModeratorRoleGuard({ children }: SuperModeratorRoleGuardProps) {
    const router = useRouter();
    const { isAuthenticated, loading, role } = useAuth();

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            return;
        }

        if (role !== "SUPER_MODERATOR") {
            router.replace("/");
        }
    }, [isAuthenticated, loading, role, router]);

    if (loading) {
        return <Message>Загрузка панели SuperAdmin…</Message>;
    }

    if (!isAuthenticated || role !== "SUPER_MODERATOR") {
        return null;
    }

    return <>{children}</>;
}
