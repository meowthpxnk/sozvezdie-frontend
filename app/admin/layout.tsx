import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
    AdminChromeProvider,
    AuthorRoleGuard,
} from "@widgets/AdminShell";
import { createPageMetadata } from "@shared/lib/page-metadata";

export const metadata: Metadata = createPageMetadata("Кабинет автора");

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AuthorRoleGuard>
            <AdminChromeProvider>{children}</AdminChromeProvider>
        </AuthorRoleGuard>
    );
}
