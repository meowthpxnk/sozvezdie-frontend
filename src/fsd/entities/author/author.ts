import type { ModerationStatus } from "./seller-product.types";

export interface Author {
    id: string;
    name: string;
    avatarImage?: string;
    bannerImage?: string;
    description?: string;
    moderationStatus?: ModerationStatus;
}
