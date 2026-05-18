import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@entities/user";
import { fetchMe, updateUserProfile } from "../../entities/auth/authThunk";

export interface IAuthStoreState extends User {
    loading: boolean;
    saving: boolean;
    isAuthenticated: boolean;
}

export type ProfileFields = Pick<User, "fullName" | "email" | "phone">;

const initialState: IAuthStoreState = {
    id: "",
    username: "",
    role: "CUSTOMER",
    fullName: null,
    email: null,
    phone: null,
    loading: false,
    saving: false,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (_state, action: PayloadAction<User>) => {
            return {
                ...action.payload,
                loading: false,
                saving: false,
                isAuthenticated: true,
            };
        },

        setProfileFields: (state, action: PayloadAction<Partial<ProfileFields>>) => {
            if (action.payload.fullName !== undefined) {
                state.fullName = action.payload.fullName;
            }
            if (action.payload.email !== undefined) {
                state.email = action.payload.email;
            }
            if (action.payload.phone !== undefined) {
                state.phone = action.payload.phone;
            }
        },

        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.id = action.payload.id;
                state.username = action.payload.username;
                state.role = action.payload.role;
                state.fullName = action.payload.fullName;
                state.email = action.payload.email;
                state.phone = action.payload.phone;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.id = "";
                state.username = "";
                state.role = "CUSTOMER";
                state.fullName = null;
                state.email = null;
                state.phone = null;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.saving = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.saving = false;
                state.id = action.payload.id;
                state.username = action.payload.username;
                state.role = action.payload.role;
                state.fullName = action.payload.fullName;
                state.email = action.payload.email;
                state.phone = action.payload.phone;
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.saving = false;
            });
    },
});

export const { setUser, setProfileFields, logout } = authSlice.actions;
