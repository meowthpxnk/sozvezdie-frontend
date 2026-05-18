"use client";

import styled from "styled-components";
import { FormEvent, useState } from "react";
import { KeyRound, LogOut, Mail, Phone, User } from "lucide-react";

import { useAuth, useProfile } from "../../entities/auth/hooks";
import { ChangePasswordModal } from "./ChangePasswordModal";

const MainWrapper = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const PageTitle = styled.h1`
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--color, #132647);
`;

const ProfileGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (min-width: 960px) {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 320px);
        gap: 24px;
        align-items: start;
    }
`;

const SectionCard = styled.section`
    background-color: #fff;
    border-radius: 14px;
    padding: 20px;
    color: #000;
    box-shadow: 0 8px 24px rgba(17, 31, 60, 0.05);

    @media (min-width: 960px) {
        padding: 24px;
        border-radius: 16px;
    }
`;

const ActionsCard = styled(SectionCard)`
    @media (min-width: 960px) {
        position: sticky;
        top: 96px;
    }
`;

const SectionTitle = styled.h3`
    margin: 0 0 6px;
    font-size: 20px;
    font-weight: 700;
    color: #000;
`;

const SectionDescription = styled.p`
    margin: 0 0 18px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    line-height: 1.45;
`;

const AccountMeta = styled.dl`
    display: grid;
    grid-template-columns: auto 1fr;
    margin: 0 0 18px;
    font-size: 14px;

    dt {
        margin: 0;
        font-weight: 600;
        color: #2d3a54;
    }

    dd {
        margin: 0;
        color: #000;
    }
`;

const FormStack = styled.form`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const FormFieldsGrid = styled.div`
    display: grid;
    gap: 14px;

    @media (min-width: 720px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

const FieldGroup = styled.div<{ $fullWidth?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;

    ${({ $fullWidth }) =>
        $fullWidth &&
        `
        @media (min-width: 720px) {
            grid-column: 1 / -1;
        }
    `}
`;

const FieldLabel = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: #2d3a54;
`;

const RequiredMark = styled.span`
    color: #e74c3c;
    font-weight: 700;
`;

const InputWithIconWrap = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 42px;
    border-radius: 8px;
    border: 1px solid #e6e6e6;
    background: #fff;
    box-sizing: border-box;

    &:focus-within {
        outline: 2px solid #4f83e3;
        outline-offset: 2px;
    }

    svg {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
        color: #7687a8;
        margin-left: 12px;
        margin-right: 8px;
    }
`;

const TextInput = styled.input`
    flex: 1;
    min-width: 0;
    height: 42px;
    border: none;
    padding: 0 12px 0 0;
    font-size: 14px;
    color: #000;
    background: transparent;
    box-sizing: border-box;

    &:focus {
        outline: none;
    }
`;

const PrimaryButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    align-self: flex-start;
    min-height: 42px;
    padding: 0 20px;
    border-radius: 8px;
    border: none;
    background: #4f83e3;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease;

    svg {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
    }

    &:hover:not(:disabled) {
        background: #3f74d6;
    }

    &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }

    &:focus-visible {
        outline: 2px solid #4f83e3;
        outline-offset: 2px;
    }
`;

const ActionBarButton = styled(PrimaryButton)`
    align-self: stretch;
    width: 100%;
`;

const FormSubmitButton = styled(ActionBarButton)`
    @media (min-width: 720px) {
        grid-column: 1 / -1;
        align-self: flex-start;
        width: auto;
        min-width: 160px;
    }
`;

const SideActions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const SideActionsTitle = styled.h3`
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 700;
    color: #000;
`;

const SideActionsDescription = styled.p`
    margin: 0 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    line-height: 1.45;
`;

const DangerButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 20px;
    border-radius: 8px;
    border: none;
    background: #dc3545;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;

    svg {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
    }

    &:hover {
        background: #c82333;
    }

    &:focus-visible {
        outline: 2px solid #dc3545;
        outline-offset: 2px;
    }
`;

export const ProfilePage = () => {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const { logout } = useAuth();
    const {
        username,
        fullName,
        email,
        phone,
        loading,
        saving,
        isAuthenticated,
        setFullName,
        setEmail,
        setPhone,
        saveProfile,
    } = useProfile();

    const onSaveProfile = (event: FormEvent) => {
        event.preventDefault();
        saveProfile();
    };

    if (loading || !isAuthenticated) {
        return null;
    }

    return (
        <MainWrapper>
            <PageTitle>Профиль</PageTitle>

            <ProfileGrid>
                <SectionCard aria-labelledby="profile-section-title">
                    <SectionTitle id="profile-section-title">Личные данные</SectionTitle>
                    <SectionDescription>
                        Обновите информацию профиля своей учетной записи и адрес электронной почты.
                    </SectionDescription>
                    <AccountMeta>
                        <dt>Логин</dt>
                        <dd>{username}</dd>
                    </AccountMeta>
                    <FormStack onSubmit={onSaveProfile}>
                        <FormFieldsGrid>
                            <FieldGroup $fullWidth>
                                <FieldLabel htmlFor="profile-full-name">
                                    Ваше ФИО (Используется для доставки) <RequiredMark>*</RequiredMark>
                                </FieldLabel>
                                <InputWithIconWrap>
                                    <User aria-hidden />
                                    <TextInput
                                        id="profile-full-name"
                                        name="fullName"
                                        type="text"
                                        autoComplete="name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </InputWithIconWrap>
                            </FieldGroup>
                            <FieldGroup>
                                <FieldLabel htmlFor="profile-email">
                                    Email <RequiredMark>*</RequiredMark>
                                </FieldLabel>
                                <InputWithIconWrap>
                                    <Mail aria-hidden />
                                    <TextInput
                                        id="profile-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </InputWithIconWrap>
                            </FieldGroup>
                            <FieldGroup>
                                <FieldLabel htmlFor="profile-phone">
                                    Номер телефона <RequiredMark>*</RequiredMark>
                                </FieldLabel>
                                <InputWithIconWrap>
                                    <Phone aria-hidden />
                                    <TextInput
                                        id="profile-phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        inputMode="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </InputWithIconWrap>
                            </FieldGroup>
                            <FormSubmitButton type="submit" disabled={saving}>
                                {saving ? "Сохранение…" : "Сохранить"}
                            </FormSubmitButton>
                        </FormFieldsGrid>
                    </FormStack>
                </SectionCard>

                <ActionsCard aria-labelledby="profile-actions-title">
                    <SideActionsTitle id="profile-actions-title">Аккаунт</SideActionsTitle>
                    <SideActionsDescription>
                        Смена пароля и выход из учётной записи.
                    </SideActionsDescription>
                    <SideActions>
                        <ActionBarButton
                            type="button"
                            onClick={() => setIsPasswordModalOpen(true)}
                        >
                            <KeyRound aria-hidden />
                            Сменить пароль
                        </ActionBarButton>
                        <DangerButton type="button" onClick={logout}>
                            <LogOut aria-hidden />
                            Выход из профиля
                        </DangerButton>
                    </SideActions>
                </ActionsCard>
            </ProfileGrid>

            {isPasswordModalOpen ? (
                <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />
            ) : null}
        </MainWrapper>
    );
};
