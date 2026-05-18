import type { ReactNode } from "react";
import {
    AdminChromeProvider,
    AuthorRoleGuard,
} from "@widgets/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AuthorRoleGuard>
            <AdminChromeProvider>{children}</AdminChromeProvider>
        </AuthorRoleGuard>
    );
}
