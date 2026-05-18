export type AssignableUserRole = "CUSTOMER" | "SELLER" | "MODERATOR";

export type SuperAdminUser = {
    id: number;
    username: string;
    role: "CUSTOMER" | "SELLER" | "MODERATOR";
    fullName: string | null;
    email: string | null;
    phone: string | null;
    isSuperModerator: boolean;
};

export interface ISuperAdminUserApiResponse {
    id: number;
    username: string;
    role: "CUSTOMER" | "SELLER" | "MODERATOR";
    full_name: string | null;
    email: string | null;
    phone: string | null;
    is_super_moderator: boolean;
}

export function mapSuperAdminUser(data: ISuperAdminUserApiResponse): SuperAdminUser {
    return {
        id: data.id,
        username: data.username,
        role: data.role,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        isSuperModerator: data.is_super_moderator,
    };
}
