import { UserRole } from "@entities/user";

export interface IMeResponse {
    id: number;
    username: string;
    role: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
}

export interface IUserProfileUpdateRequest {
    full_name: string | null;
    email: string | null;
    phone: string | null;
}

export interface IChangePasswordRequest {
    current_password: string;
    new_password: string;
}

export interface IUserProfileResponse {
    id: number;
    username: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
}

export const mapBackendRole = (role: string): UserRole => {
    switch (role) {
        case "SELLER":
            return "AUTHOR";
        case "MODERATOR":
            return "MODERATOR";
        case "SUPER_MODERATOR":
            return "SUPER_MODERATOR";
        case "ADMIN":
            return "ADMIN";
        case "CUSTOMER":
            return "CUSTOMER";
        default:
            return "CUSTOMER";
    }
};
