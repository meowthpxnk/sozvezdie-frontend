"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/src/fsd/shared/store/store";
// import { fetchCart } from "@/entities/cart/model/cartThunks";
import { getAccessToken } from "@shared/services/auth-token.service";
import { fetchMe } from "@/src/fsd/entities/auth/authThunk";
import { fetchCart } from "@/src/fsd/entities/cart/cartThunk";
import {
    fetchFavouriteAuthors,
    fetchFavouriteProducts,
} from "@/src/fsd/entities/favourite/favouriteThunk";

export const AppInitializer = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = getAccessToken();

        if (token) {
            dispatch(fetchMe());
            dispatch(fetchCart());
            dispatch(fetchFavouriteProducts());
            dispatch(fetchFavouriteAuthors());
        }
    }, [dispatch]);

    return null;
};
