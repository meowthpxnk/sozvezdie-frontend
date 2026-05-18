import type { UserRole } from "@entities/user";
import { canAccessModeration, isAuthorRole, isSuperModeratorRole } from "@shared/lib/roles";

import {
    AuthorManagementButtonsMap,
    AuthorManagementEntryButton,
    ModeratorManagementButtonsMap,
    ModeratorManagementEntryButton,
    SuperAdminManagementButtonsMap,
    SuperAdminManagementEntryButton,
    UserButtonMap,
} from "./LinkMaps";
import type { HeaderNavMode } from "./header-nav";

export type HeaderActionsRole = UserRole | "USER";

export interface HeaderActionsProps {
    mode: HeaderNavMode;
    role?: UserRole;
    pathname: string;
}

export const HeaderActions = ({ mode, role, pathname }: HeaderActionsProps) => {
    switch (mode) {
        case "author-management":
            return <AuthorManagementButtonsMap pathname={pathname} />;

        case "moderator-management":
            return (
                <>
                    <ModeratorManagementButtonsMap pathname={pathname} />
                    {isSuperModeratorRole(role) ? (
                        <SuperAdminManagementEntryButton pathname={pathname} />
                    ) : null}
                </>
            );

        case "super-admin-management":
            return (
                <>
                    <SuperAdminManagementButtonsMap pathname={pathname} />
                    <ModeratorManagementEntryButton pathname={pathname} />
                </>
            );

        case "storefront":
        default:
            return (
                <>
                    <UserButtonMap pathname={pathname} />
                    {isAuthorRole(role) ? (
                        <AuthorManagementEntryButton pathname={pathname} />
                    ) : null}
                    {canAccessModeration(role) && !isSuperModeratorRole(role) ? (
                        <ModeratorManagementEntryButton pathname={pathname} />
                    ) : null}
                    {isSuperModeratorRole(role) ? (
                        <SuperAdminManagementEntryButton pathname={pathname} />
                    ) : null}
                </>
            );
    }
};

export default HeaderActions;
