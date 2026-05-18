export interface User {
    id: string;
    role: UserRole;
    username: string;
    fullName: string | null;
    email: string | null;
    phone: string | null;
}

export type UserRole = "AUTHOR" | "CUSTOMER" | "MODERATOR" | "ADMIN" | "SUPER_MODERATOR";
