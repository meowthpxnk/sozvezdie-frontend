import { axiosWithAuth } from "@shared/api/interceptors";
import type { ModerationStatus } from "@entities/author/seller-product.types";

import {
    type IModerationEditApiResponse,
    type IModerationProposalApiResponse,
    mapModerationEdit,
    mapModerationProposal,
    type ModerationEdit,
    type ModerationProposal,
} from "./moderation.types";
import {
    type ISellerProductApiResponse,
    mapSellerProduct,
    type SellerProduct,
} from "@entities/author/seller-product.types";

class ModerationService {
    private BASE_URL = "/moderation";

    async getProposals(status?: ModerationStatus): Promise<ModerationProposal[]> {
        const response = await axiosWithAuth.get<IModerationProposalApiResponse[]>(
            `${this.BASE_URL}/proposals`,
            {
                params: status ? { status } : undefined,
            }
        );

        return response.data.map(mapModerationProposal);
    }

    async getProposalEdit(proposalId: string): Promise<ModerationEdit> {
        const response = await axiosWithAuth.get<IModerationEditApiResponse>(
            `${this.BASE_URL}/proposals/${proposalId}`
        );

        return mapModerationEdit(response.data);
    }

    async updateProposalProduct(
        proposalId: string,
        data: {
            name: string;
            desc: string;
            price: number;
            quantity: number;
            imageSlots: Array<{ type: "existing"; uuid: string } | { type: "new" }>;
            files: File[];
            categorySlug?: string;
            subcategorySlug?: string;
            fandomSlug?: string;
        }
    ): Promise<SellerProduct> {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("desc", data.desc);
        formData.append("price", String(data.price));
        formData.append("quantity", String(data.quantity));
        formData.append("image_slots", JSON.stringify(data.imageSlots));

        for (const file of data.files) {
            formData.append("files", file);
        }

        if (data.categorySlug) {
            formData.append("category_slug", data.categorySlug);
        }
        if (data.subcategorySlug) {
            formData.append("subcategory_slug", data.subcategorySlug);
        }
        if (data.fandomSlug) {
            formData.append("fandom_slug", data.fandomSlug);
        }

        const response = await axiosWithAuth.put<ISellerProductApiResponse>(
            `${this.BASE_URL}/proposals/${proposalId}/product`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return mapSellerProduct(response.data);
    }

    async updateProposalBrand(
        proposalId: string,
        data: {
            name: string;
            desc: string;
            avatarFile: File | null;
            bannerFile: File | null;
        }
    ): Promise<ModerationEdit> {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("desc", data.desc);

        if (data.avatarFile) {
            formData.append("avatar_image", data.avatarFile);
        }
        if (data.bannerFile) {
            formData.append("banner_image", data.bannerFile);
        }

        const response = await axiosWithAuth.put<IModerationEditApiResponse>(
            `${this.BASE_URL}/proposals/${proposalId}/brand`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return mapModerationEdit(response.data);
    }

    async decide(
        proposalId: string,
        data: {
            status: Extract<ModerationStatus, "APPROVED" | "REJECTED">;
            comment?: string;
        }
    ): Promise<ModerationProposal> {
        const response = await axiosWithAuth.post<IModerationProposalApiResponse>(
            `${this.BASE_URL}/proposals/${proposalId}/decide`,
            data
        );

        return mapModerationProposal(response.data);
    }

    async getCatalogProductEdit(productId: string): Promise<ModerationEdit> {
        const response = await axiosWithAuth.get<IModerationEditApiResponse>(
            `${this.BASE_URL}/catalog/products/${productId}`
        );

        return mapModerationEdit(response.data);
    }

    async updateCatalogProduct(
        productId: string,
        data: {
            name: string;
            desc: string;
            price: number;
            quantity: number;
            imageSlots: Array<{ type: "existing"; uuid: string } | { type: "new" }>;
            files: File[];
            categorySlug?: string;
            subcategorySlug?: string;
            fandomSlug?: string;
            comment?: string;
        }
    ): Promise<SellerProduct> {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("desc", data.desc);
        formData.append("price", String(data.price));
        formData.append("quantity", String(data.quantity));
        formData.append("image_slots", JSON.stringify(data.imageSlots));

        for (const file of data.files) {
            formData.append("files", file);
        }

        if (data.categorySlug) {
            formData.append("category_slug", data.categorySlug);
        }
        if (data.subcategorySlug) {
            formData.append("subcategory_slug", data.subcategorySlug);
        }
        if (data.fandomSlug) {
            formData.append("fandom_slug", data.fandomSlug);
        }
        if (data.comment?.trim()) {
            formData.append("comment", data.comment.trim());
        }

        const response = await axiosWithAuth.put<ISellerProductApiResponse>(
            `${this.BASE_URL}/catalog/products/${productId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return mapSellerProduct(response.data);
    }

    async getCatalogBrandEdit(sellerCardId: string): Promise<ModerationEdit> {
        const response = await axiosWithAuth.get<IModerationEditApiResponse>(
            `${this.BASE_URL}/catalog/brands/${sellerCardId}`
        );

        return mapModerationEdit(response.data);
    }

    async updateCatalogBrand(
        sellerCardId: string,
        data: {
            name: string;
            desc: string;
            avatarFile: File | null;
            bannerFile: File | null;
            comment?: string;
        }
    ): Promise<ModerationEdit> {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("desc", data.desc);

        if (data.avatarFile) {
            formData.append("avatar_image", data.avatarFile);
        }
        if (data.bannerFile) {
            formData.append("banner_image", data.bannerFile);
        }
        if (data.comment?.trim()) {
            formData.append("comment", data.comment.trim());
        }

        const response = await axiosWithAuth.put<IModerationEditApiResponse>(
            `${this.BASE_URL}/catalog/brands/${sellerCardId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return mapModerationEdit(response.data);
    }
}

export const moderationService = new ModerationService();
