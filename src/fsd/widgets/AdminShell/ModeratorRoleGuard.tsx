"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import styled from "styled-components";

import { useAuth } from "@entities/auth";
import { canAccessModeration } from "@shared/lib/roles";

const Message = styled.p`
    margin: 0;
    font-size: 15px;
    color: var(--cart-summary-text-color, #666);
`;

type ModeratorRoleGuardProps = {
    children: ReactNode;
};

export function ModeratorRoleGuard({ children }: ModeratorRoleGuardProps) {
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

        if (!canAccessModeration(role)) {
            router.replace("/");
        }
    }, [isAuthenticated, loading, role, router]);

    if (loading) {
        return <Message>Загрузка панели модерации…</Message>;
    }

    if (!isAuthenticated || !canAccessModeration(role)) {
        return null;
    }

    return <>{children}</>;
}
