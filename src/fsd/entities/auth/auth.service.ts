import {
    AccessTokenResponse,
    IAuthForm,
    IRegisterForm,
    IVkAuthoriseRequest,
} from "@shared/types/auth.types";

import { axiosClassic, axiosWithAuth } from "@shared/api/interceptors";
import { saveAccessToken } from "./auth-token.service";
import {
    IChangePasswordRequest,
    IMeResponse,
    IUserProfileResponse,
    IUserProfileUpdateRequest,
} from "./auth.types";

class AuthService {
    private BASE_URL = "";

    async authorisate(data: IAuthForm) {
        const response = await axiosClassic.post<AccessTokenResponse>(
            `${this.BASE_URL}/authorisate`,
            data
        );

        saveAccessToken(response.data["Access-Token"]);
    }

    async authoriseVk(payload: IVkAuthoriseRequest) {
        const response = await axiosClassic.post<AccessTokenResponse>(
            `${this.BASE_URL}/authorise_vk`,
            payload
        );
        saveAccessToken(response.data["Access-Token"]);
    }

    async register(data: IRegisterForm) {
        await axiosClassic.post(`${this.BASE_URL}/create-user`, {
            username: data.username,
            password: data.password,
            role: "CUSTOMER",
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
        });
    }

    async refreshSession() {
        const response = await axiosClassic.post<AccessTokenResponse>(
            `${this.BASE_URL}/refresh-session`
        );
        saveAccessToken(response.data["Access-Token"]);
        return response.data["Access-Token"];
    }

    async getMe() {
        const response = await axiosWithAuth.get<IMeResponse>(
            `${this.BASE_URL}/me`
        );
        return response.data;
    }

    async updateProfile(data: IUserProfileUpdateRequest) {
        const response = await axiosWithAuth.put<IUserProfileResponse>(
            `${this.BASE_URL}/user/profile`,
            data
        );
        return response.data;
    }

    async changePassword(data: IChangePasswordRequest) {
        const response = await axiosWithAuth.patch<{ detail: string }>(
            `${this.BASE_URL}/change-password`,
            data
        );
        return response.data;
    }
}

const authService = new AuthService();
export default authService;
