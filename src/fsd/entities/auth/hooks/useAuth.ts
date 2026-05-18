"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { removeAccessToken } from "../auth-token.service";
import { logout } from "../../../shared/store/AuthSlice";
import { RootState, useAppDispatch, useAppSelector } from "../../../shared/store/store";
import sessionService from "../../../shared/services/session.service";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const auth = useAppSelector((state: RootState) => state.auth);

    const handleLogout = useCallback(async () => {
        try {
            await sessionService.logout();
        } catch {
            // session may already be invalid
        }
        removeAccessToken();
        dispatch(logout());
        router.push("/auth");
    }, [dispatch, router]);

    return {
        id: auth.id,
        username: auth.username,
        role: auth.role,
        fullName: auth.fullName,
        email: auth.email,
        phone: auth.phone,
        loading: auth.loading,
        isAuthenticated: auth.isAuthenticated,
        logout: handleLogout,
    };
};
