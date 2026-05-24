import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@entities/user";

import authService from "./auth.service";
import {
    IUserProfileResponse,
    mapBackendRole,
} from "./auth.types";

type AuthProfileState = Pick<User, "fullName" | "email" | "phone" | "role">;

const mapMeToUser = (
    me: Awaited<ReturnType<typeof authService.getMe>>
): User => ({
    id: String(me.id),
    username: me.username,
    role: mapBackendRole(me.role),
    fullName: me.full_name,
    email: me.email,
    phone: me.phone,
});

const mapProfileResponseToUser = (
    profile: IUserProfileResponse,
    role: User["role"]
): User => ({
    id: String(profile.id),
    username: profile.username,
    role,
    fullName: profile.full_name,
    email: profile.email,
    phone: profile.phone,
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, thunkAPI) => {
    try {
        const me = await authService.getMe();
        return mapMeToUser(me);
    } catch {
        return thunkAPI.rejectWithValue("Failed to fetch user profile");
    }
});

export const updateUserProfile = createAsyncThunk(
    "auth/updateUserProfile",
    async (_, { getState, rejectWithValue }) => {
        const { auth } = getState() as { auth: AuthProfileState };

        try {
            const profile = await authService.updateProfile({
                full_name: auth.fullName?.trim() || null,
                email: auth.email?.trim() || null,
                phone: auth.phone?.trim() || null,
            });
            return mapProfileResponseToUser(profile, auth.role);
        } catch {
            return rejectWithValue("Failed to update user profile");
        }
    }
);
