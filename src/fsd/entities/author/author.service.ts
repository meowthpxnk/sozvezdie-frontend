import { axiosWithAuth, axiosClassic } from "@shared/api/interceptors";
import { Author } from "./author";
import {
    type AuthorDashboard,
    type IAuthorDashboardApiResponse,
    mapAuthorDashboard,
} from "./author-dashboard.types";
import {
    type ISellerProductApiResponse,
    mapSellerProduct,
    type SellerProduct,
} from "./seller-product.types";
import { Product } from "../product";

class AuthorService {
    private BASE_URL = "/author";
    private AUTHORS_URL = "/authors";

    async getAuthors() {
        const response = await axiosClassic.get<Author[]>(`${this.BASE_URL}`);
        return response.data;
    }

    async getPopularAuthors() {
        const response = await axiosClassic.get<Author[]>(this.AUTHORS_URL, {
            params: { popular: true },
        });
        return response.data;
    }

    async getAuthor(id: string) {
        const response = await axiosClassic.get<Author>(`${this.BASE_URL}/${id}`);
        // console.log(response.data);
        return response.data;
    }

    async getAuthorsBulk(ids: string[]) {
        if (!ids.length) {
            return [];
        }

        const response = await axiosClassic.get<Author[]>(`${this.BASE_URL}/bulk`, {
            params: { ids: ids.join(",") },
        });
        return response.data;
    }

    async getProductsByAuthor(authorId: string) {
        const response = await axiosClassic.get<Product[]>(`${this.BASE_URL}/${authorId}/products`);
        return response.data;
    }

    async getMyDashboard(): Promise<AuthorDashboard> {
        const response = await axiosWithAuth.get<IAuthorDashboardApiResponse>(
            `${this.BASE_URL}/me`
        );
        return mapAuthorDashboard(response.data);
    }

    async getMyProducts(): Promise<SellerProduct[]> {
        const response = await axiosWithAuth.get<ISellerProductApiResponse[]>(
            `${this.BASE_URL}/me/products`
        );
        return response.data.map(mapSellerProduct);
    }

    async getMyProduct(productId: string): Promise<SellerProduct> {
        const response = await axiosWithAuth.get<ISellerProductApiResponse>(
            `${this.BASE_URL}/me/products/${productId}`
        );
        return mapSellerProduct(response.data);
    }

    async updateMyProduct(
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
            `${this.BASE_URL}/me/products/${productId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return mapSellerProduct(response.data);
    }

    async createSellerCard(data: {
        name: string;
        desc: string;
        avatarFile: File;
        bannerFile: File;
    }) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("desc", data.desc);
        formData.append("avatar_image", data.avatarFile);
        formData.append("banner_image", data.bannerFile);

        const response = await axiosWithAuth.post<{
            id: string;
            name: string;
            desc: string;
            bannerImage: string | null;
            avatarImage: string | null;
            moderationStatus: import("./seller-product.types").ModerationStatus;
        }>(`${this.BASE_URL}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return {
            id: response.data.id,
            name: response.data.name,
            description: response.data.desc,
            bannerImage: response.data.bannerImage ?? undefined,
            avatarImage: response.data.avatarImage ?? undefined,
            moderationStatus: response.data.moderationStatus,
        } satisfies Author;
    }

    async updateSellerCard(data: {
        name: string;
        desc: string;
        avatarFile?: File | null;
        bannerFile?: File | null;
    }) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("desc", data.desc);
        if (data.avatarFile) {
            formData.append("avatar_image", data.avatarFile);
        }
        if (data.bannerFile) {
            formData.append("banner_image", data.bannerFile);
        }

        const response = await axiosWithAuth.put<{
            id: string;
            name: string;
            desc: string;
            bannerImage: string | null;
            avatarImage: string | null;
            moderationStatus: import("./seller-product.types").ModerationStatus;
        }>(`${this.BASE_URL}/me`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return {
            id: response.data.id,
            name: response.data.name,
            description: response.data.desc,
            bannerImage: response.data.bannerImage ?? undefined,
            avatarImage: response.data.avatarImage ?? undefined,
            moderationStatus: response.data.moderationStatus,
        } satisfies Author;
    }

    async getMyBrandModerations() {
        const response = await axiosWithAuth.get<
            Array<{
                id: string;
                createdAt: string;
                actionType: string;
                status: import("./seller-product.types").ModerationStatus;
                title: string;
                details: string[];
                moderatorComment?: string | null;
            }>
        >(`${this.BASE_URL}/me/brand-moderations`);

        return response.data;
    }


    // async deleteDevice(device_name: TypeDeviceName) {
    //     await axiosWithAuth.delete(`${this.BASE_URL}/${device_name}`);
    // }

    // async updateDevcie(data: IDeviceProps) {
    //     await axiosWithAuth.put(`${this.BASE_URL}/${data.name}`, data);
    // }

    // async createDevice(device: IDevice) {
    //     await axiosWithAuth.post(`${this.BASE_URL}/create`, device);
    // }

    // async reloadDevice(device_name: TypeDeviceName) {
    //     await axiosWithAuth.patch(`${this.BASE_URL}/${device_name}/reload`);
    // }

    // async stopDevice(device_name: TypeDeviceName) {
    //     await axiosWithAuth.patch(`${this.BASE_URL}/${device_name}/stop`);
    // }

    // async startDevice(device_name: TypeDeviceName) {
    //     await axiosWithAuth.patch(`${this.BASE_URL}/${device_name}/start`);
    // }

    // async removeAuth(device_name: TypeDeviceName) {
    //     await axiosWithAuth.patch(
    //         `${this.BASE_URL}/${device_name}/remove_auth`
    //     );
    // }

    // async clearOutbox(device_name: TypeDeviceName) {
    //     await axiosWithAuth.patch(
    //         `${this.BASE_URL}/${device_name}/clear_outbox`
    //     );
    // }

    // async updateProxy(device_name: TypeDeviceName) {
    //     await axiosWithAuth.patch(`${this.BASE_URL}/${device_name}/proxy`);
    // }
}

const authorService = new AuthorService();
export default authorService;
