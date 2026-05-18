import type { ReactNode } from "react";

import { AdminChromeProvider, SuperModeratorRoleGuard } from "@widgets/AdminShell";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
    return (
        <AdminChromeProvider>
            <SuperModeratorRoleGuard>{children}</SuperModeratorRoleGuard>
        </AdminChromeProvider>
    );
}
