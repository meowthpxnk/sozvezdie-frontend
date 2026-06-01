"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    superAdminService,
    type AssignableUserRole,
    type SuperAdminUser,
} from "@entities/super-admin";
import { SetAdminChrome } from "@widgets/AdminShell";

const Card = styled.section`
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 8px 24px rgba(17, 31, 60, 0.05);
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const SearchInput = styled.input`
    width: 100%;
    min-height: 42px;
    border-radius: 10px;
    border: 1px solid #d7ddea;
    padding: 0 12px;
    font-size: 14px;
    color: #132647;
    box-sizing: border-box;

    &:focus {
        outline: 2px solid var(--main-color);
        outline-offset: 1px;
    }
`;

const UserRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 0;
    border-bottom: 1px solid #eef1f6;

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    @media (min-width: 720px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

const UserMeta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
`;

const UserName = styled.p`
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #132647;
`;

const UserDetails = styled.p`
    margin: 0;
    font-size: 13px;
    color: #6b7890;
`;

const RoleControls = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
`;

const RoleSelect = styled.select`
    min-height: 38px;
    border-radius: 8px;
    border: 1px solid #d7ddea;
    padding: 0 10px;
    font-size: 14px;
    color: #132647;
    background: #fff;
`;

const SaveButton = styled.button`
    min-height: 38px;
    padding: 0 14px;
    border: none;
    border-radius: 8px;
    background: var(--main-color);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const EmptyState = styled.p`
    margin: 0;
    font-size: 14px;
    color: #6b7890;
`;

const ROLE_LABELS: Record<AssignableUserRole, string> = {
    CUSTOMER: "Покупатель",
    SELLER: "Продавец (Seller)",
    MODERATOR: "Модератор",
};

const ASSIGNABLE_ROLES: AssignableUserRole[] = ["CUSTOMER", "SELLER", "MODERATOR"];

function isAssignableRole(role: SuperAdminUser["role"]): role is AssignableUserRole {
    return role === "CUSTOMER" || role === "SELLER" || role === "MODERATOR";
}

export function SuperAdminUsersPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [draftRoles, setDraftRoles] = useState<Record<number, AssignableUserRole>>({});

    const usersQuery = useQuery({
        queryKey: ["super-admin", "users", search],
        queryFn: () => superAdminService.getUsers(search.trim() || undefined),
    });

    const assignMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: number; role: AssignableUserRole }) =>
            superAdminService.assignRole(userId, role),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] });
            toast.success("Роль обновлена");
        },
        onError: () => {
            toast.error("Не удалось обновить роль");
        },
    });

    const users = usersQuery.data ?? [];

    const editableUsers = useMemo(
        () => users.filter((user) => !user.isSuperModerator),
        [users]
    );

    return (
        <>
            <SetAdminChrome title="Пользователи" />
            <Card>
                <SearchInput
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Поиск по логину, имени или email"
                />
                {usersQuery.isLoading ? <EmptyState>Загрузка…</EmptyState> : null}
                {usersQuery.isError ? (
                    <EmptyState>Не удалось загрузить список пользователей.</EmptyState>
                ) : null}
                {!usersQuery.isLoading && editableUsers.length === 0 ? (
                    <EmptyState>Пользователи не найдены.</EmptyState>
                ) : null}
                {editableUsers.map((user) => {
                    const currentRole =
                        draftRoles[user.id] ??
                        (isAssignableRole(user.role) ? user.role : "CUSTOMER");
                    const canSave = !user.isSuperModerator && currentRole !== user.role;

                    return (
                        <UserRow key={user.id}>
                            <UserMeta>
                                <UserName>@{user.username}</UserName>
                                <UserDetails>
                                    {user.fullName || "—"} ·{" "}
                                    {isAssignableRole(user.role)
                                        ? ROLE_LABELS[user.role]
                                        : user.role}
                                </UserDetails>
                                {user.email ? <UserDetails>{user.email}</UserDetails> : null}
                            </UserMeta>
                            <RoleControls>
                                <RoleSelect
                                    value={currentRole}
                                    onChange={(event) =>
                                        setDraftRoles((prev) => ({
                                            ...prev,
                                            [user.id]: event.target.value as AssignableUserRole,
                                        }))
                                    }
                                >
                                    {ASSIGNABLE_ROLES.map((role) => (
                                        <option key={role} value={role}>
                                            {ROLE_LABELS[role]}
                                        </option>
                                    ))}
                                </RoleSelect>
                                <SaveButton
                                    type="button"
                                    disabled={!canSave || assignMutation.isPending}
                                    onClick={() =>
                                        assignMutation.mutate({
                                            userId: user.id,
                                            role: currentRole,
                                        })
                                    }
                                >
                                    Сохранить
                                </SaveButton>
                            </RoleControls>
                        </UserRow>
                    );
                })}
            </Card>
        </>
    );
}
