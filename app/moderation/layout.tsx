import type { ReactNode } from "react";

import { AdminChromeProvider, ModeratorRoleGuard } from "@widgets/AdminShell";

export default function ModerationLayout({ children }: { children: ReactNode }) {
    return (
        <AdminChromeProvider>
            <ModeratorRoleGuard>{children}</ModeratorRoleGuard>
        </AdminChromeProvider>
    );
}
