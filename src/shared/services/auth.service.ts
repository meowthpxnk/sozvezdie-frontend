import {
    AccessTokenResponse,
    IAuthForm,
    IVkAuthoriseRequest,
} from "@/shared/types/auth.types";

import { axiosClassic } from "@/shared/api/interceptors";
import { saveAccessToken } from "./auth-token.service";

class AuthService {
    private BASE_URL = "";

    async authorisate(data: IAuthForm) {
        const response = await axiosClassic.post<AccessTokenResponse>(
            `${this.BASE_URL}/authorisate`,
            data
        );
        saveAccessToken(response.data["Access-Token"]);
    }

    async authoriseVk(vk_access_token: string) {
        const body: IVkAuthoriseRequest = { vk_access_token };
        const response = await axiosClassic.post<AccessTokenResponse>(
            `${this.BASE_URL}/authorise_vk`,
            body
        );
        saveAccessToken(response.data["Access-Token"]);
    }

    async refreshSession() {
        const response = await axiosClassic.post<AccessTokenResponse>(
            `${this.BASE_URL}/refresh-session`
        );
        saveAccessToken(response.data["Access-Token"]);
        return response.data["Access-Token"];
    }
}

const authService = new AuthService();
export default authService;
