"use client";

import styled from "styled-components";
import { FormEvent, useState } from "react";
import { Lock, LogIn, User } from "lucide-react";

const AuthLayout = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    min-height: 0;
`;

const AuthCardWrapper = styled.div`
    width: 100%;
    max-width: 420px;
    background-color: #fff;
    border-radius: 14px;
    padding: 20px;
`;

const AuthTitleWrapper = styled.h2`
    margin: 0 0 18px;
    font-size: 28px;
    color: var(--color, #000);
`;

const AuthFormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
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

    &::placeholder {
        color: #8a97b1;
    }
`;

const SubmitButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
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

    &:hover {
        background: #3f74d6;
    }

    &:focus-visible {
        outline: 2px solid #4f83e3;
        outline-offset: 2px;
    }
`;

export const AuthPage = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
    };

    return (
        <AuthLayout>
            <AuthCardWrapper>
                <AuthFormWrapper onSubmit={onSubmit}>
                    <FieldGroup>
                        <FieldLabel htmlFor="auth-login">
                            Логин <RequiredMark>*</RequiredMark>
                        </FieldLabel>
                        <InputWithIconWrap>
                            <User aria-hidden />
                            <TextInput
                                id="auth-login"
                                name="login"
                                type="text"
                                autoComplete="username"
                                placeholder="Логин"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </InputWithIconWrap>
                    </FieldGroup>
                    <FieldGroup>
                        <FieldLabel htmlFor="auth-password">
                            Пароль <RequiredMark>*</RequiredMark>
                        </FieldLabel>
                        <InputWithIconWrap>
                            <Lock aria-hidden />
                            <TextInput
                                id="auth-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </InputWithIconWrap>
                    </FieldGroup>
                    <SubmitButton type="submit">
                        <LogIn aria-hidden />
                        Войти
                    </SubmitButton>
                </AuthFormWrapper>
            </AuthCardWrapper>
        </AuthLayout>
    );
};
