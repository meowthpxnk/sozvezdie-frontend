import { axiosWithAuth } from "@shared/api/interceptors";
import type { AdvertBanner } from "@entities/advert-banner/advert-banner";
import {
    type FaqItem,
    type FaqItemApiResponse,
    type FaqItemPayload,
    mapFaqItem,
} from "@entities/faq/faq.types";

import {
    type AssignableUserRole,
    type ISuperAdminUserApiResponse,
    mapSuperAdminUser,
    type SuperAdminUser,
} from "./super-admin.types";

class SuperAdminService {
    private BASE_URL = "/super-admin";

    async getUsers(search?: string): Promise<SuperAdminUser[]> {
        const response = await axiosWithAuth.get<ISuperAdminUserApiResponse[]>(
            `${this.BASE_URL}/users`,
            {
                params: search ? { search } : undefined,
            }
        );

        return response.data.map(mapSuperAdminUser);
    }

    async assignRole(userId: number, role: AssignableUserRole): Promise<SuperAdminUser> {
        const response = await axiosWithAuth.patch<ISuperAdminUserApiResponse>(
            `${this.BASE_URL}/users/${userId}/role`,
            { role }
        );

        return mapSuperAdminUser(response.data);
    }

    async getBanners(): Promise<AdvertBanner[]> {
        const response = await axiosWithAuth.get<AdvertBanner[]>(`${this.BASE_URL}/banners`);
        return response.data;
    }

    async createBanner(data: {
        image: File;
        link: string;
        text: string;
    }): Promise<AdvertBanner> {
        const formData = new FormData();
        formData.append("image", data.image);
        formData.append("link", data.link);
        formData.append("text", data.text);

        const response = await axiosWithAuth.post<AdvertBanner>(
            `${this.BASE_URL}/banners`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    }

    async updateBanner(
        bannerId: number,
        data: {
            link: string;
            text: string;
            image?: File | null;
        }
    ): Promise<AdvertBanner> {
        const formData = new FormData();
        formData.append("link", data.link);
        formData.append("text", data.text);
        if (data.image) {
            formData.append("image", data.image);
        }

        const response = await axiosWithAuth.put<AdvertBanner>(
            `${this.BASE_URL}/banners/${bannerId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    }

    async deleteBanner(bannerId: number): Promise<void> {
        await axiosWithAuth.delete(`${this.BASE_URL}/banners/${bannerId}`);
    }

    async getFaqItems(search?: string): Promise<FaqItem[]> {
        const response = await axiosWithAuth.get<FaqItemApiResponse[]>(
            `${this.BASE_URL}/faq`,
            {
                params: search ? { search } : undefined,
            }
        );

        return response.data.map(mapFaqItem);
    }

    async createFaqItem(data: FaqItemPayload): Promise<FaqItem> {
        const response = await axiosWithAuth.post<FaqItemApiResponse>(
            `${this.BASE_URL}/faq`,
            {
                question: data.question,
                answer: data.answer,
            }
        );

        return mapFaqItem(response.data);
    }

    async updateFaqItem(itemId: number, data: FaqItemPayload): Promise<FaqItem> {
        const response = await axiosWithAuth.put<FaqItemApiResponse>(
            `${this.BASE_URL}/faq/${itemId}`,
            {
                question: data.question,
                answer: data.answer,
            }
        );

        return mapFaqItem(response.data);
    }

    async reorderFaqItems(orderedIds: number[]): Promise<FaqItem[]> {
        const response = await axiosWithAuth.put<FaqItemApiResponse[]>(
            `${this.BASE_URL}/faq/reorder`,
            { ordered_ids: orderedIds }
        );

        return response.data.map(mapFaqItem);
    }

    async deleteFaqItem(itemId: number): Promise<void> {
        await axiosWithAuth.delete(`${this.BASE_URL}/faq/${itemId}`);
    }
}

export const superAdminService = new SuperAdminService();
