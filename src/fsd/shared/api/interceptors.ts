import { getAccessToken } from "@shared/services/auth-token.service";
import { redirectToLogin } from "@shared/lib/auth-session";
import { API_URL, MEDIA_URL } from "@shared/config/public-env";
import { parse422 } from "@shared/utils/Error422";
import axios, { CreateAxiosDefaults } from "axios";
import { toast } from "sonner";

export { MEDIA_URL };

const BASE_URL = API_URL;

const options: CreateAxiosDefaults = {
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
};

const axiosClassic = axios.create(options);
const axiosWithAuth = axios.create(options);

let isRefreshing = false;
let refreshSubscribers: Function[] = [];

axiosWithAuth.interceptors.request.use((config) => {
    const accessToken = getAccessToken();
    if (config?.headers && accessToken)
        config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

axiosWithAuth.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._isRetry) {
            originalRequest._isRetry = true;

            if (isRefreshing) {
                return new Promise((resolve) => {
                    refreshSubscribers.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosWithAuth.request(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const { default: authService } = await import(
                    "@shared/services/auth.service"
                );
                const newAccessToken = await authService.refreshSession();

                refreshSubscribers.forEach((callback) =>
                    callback(newAccessToken)
                );
                refreshSubscribers = [];

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosWithAuth.request(originalRequest);
            } catch (error) {
                refreshSubscribers = [];
                redirectToLogin();
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        if (error?.response?.status === 400) {
            toast.error(error?.response?.data?.error);
        } else if (error?.response?.status === 422) {
            toast.error("Validation error", {
                description: parse422(error?.response?.data).join("; "),
            });
        }

        throw error;
    }
);

export { axiosClassic, axiosWithAuth };
