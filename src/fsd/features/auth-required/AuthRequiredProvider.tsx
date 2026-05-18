"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { getAccessToken } from "@entities/auth/auth-token.service";

import { AuthRequiredModal } from "./AuthRequiredModal";

type AuthRequiredContextValue = {
    openAuthRequired: () => void;
    closeAuthRequired: () => void;
    requireAuth: (action?: () => void) => boolean;
    isAuthenticated: () => boolean;
};

const AuthRequiredContext = createContext<AuthRequiredContextValue | null>(null);

export function AuthRequiredProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const isAuthenticated = useCallback(() => Boolean(getAccessToken()), []);

    const openAuthRequired = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeAuthRequired = useCallback(() => {
        setIsOpen(false);
    }, []);

    const requireAuth = useCallback(
        (action?: () => void) => {
            if (isAuthenticated()) {
                action?.();
                return true;
            }

            openAuthRequired();
            return false;
        },
        [isAuthenticated, openAuthRequired]
    );

    const value = useMemo(
        () => ({
            openAuthRequired,
            closeAuthRequired,
            requireAuth,
            isAuthenticated,
        }),
        [openAuthRequired, closeAuthRequired, requireAuth, isAuthenticated]
    );

    return (
        <AuthRequiredContext.Provider value={value}>
            {children}
            <AuthRequiredModal isOpen={isOpen} onClose={closeAuthRequired} />
        </AuthRequiredContext.Provider>
    );
}

export function useAuthRequired() {
    const context = useContext(AuthRequiredContext);

    if (!context) {
        throw new Error("useAuthRequired must be used within AuthRequiredProvider");
    }

    return context;
}
