"use client";

import { useEffect, useRef, useState } from "react";

import {
    Config,
    ConfigResponseMode,
    ConfigSource,
    OneTap,
    OneTapInternalEvents,
    WidgetEvents,
} from "@vkid/sdk";

import { VKID_APP_ID, VKID_REDIRECT_URL } from "@shared/config/public-env";

import { generateCodeVerifier } from "./vk-code-verifier";

export type VkAuthorisePayload = {
    code: string;
    deviceId: string;
    codeVerifier: string;
};

type VkLoginPayload = {
    code: string;
    device_id: string;
};

type VkIdOneTapProps = {
    onVkAuth: (payload: VkAuthorisePayload) => Promise<void>;
    onError?: (error: unknown) => void;
};

export function VkIdOneTap({ onVkAuth, onError }: VkIdOneTapProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const codeVerifierRef = useRef<string>(generateCodeVerifier());
    const [isLoading, setIsLoading] = useState(false);
    const isLoadingRef = useRef(false);
    const onVkAuthRef = useRef(onVkAuth);
    const onErrorRef = useRef(onError);

    onVkAuthRef.current = onVkAuth;
    onErrorRef.current = onError;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        Config.init({
            app: VKID_APP_ID,
            redirectUrl: VKID_REDIRECT_URL,
            responseMode: ConfigResponseMode.Callback,
            source: ConfigSource.LOWCODE,
            scope: "",
            codeVerifier: codeVerifierRef.current,
        });

        const oneTap = new OneTap();

        oneTap
            .render({
                container,
                fastAuthEnabled: false,
            })
            .on(WidgetEvents.ERROR, (error: unknown) => {
                onErrorRef.current?.(error);
            })
            .on(OneTapInternalEvents.LOGIN_SUCCESS, (payload: VkLoginPayload) => {
                if (isLoadingRef.current) return;

                isLoadingRef.current = true;
                setIsLoading(true);

                void onVkAuthRef
                    .current({
                        code: payload.code,
                        deviceId: payload.device_id,
                        codeVerifier: codeVerifierRef.current,
                    })
                    .catch((error: unknown) => {
                        onErrorRef.current?.(error);
                    })
                    .finally(() => {
                        isLoadingRef.current = false;
                        setIsLoading(false);
                    });
            });

        return () => {
            container.innerHTML = "";
        };
    }, []);

    return (
        <div
            ref={containerRef}
            id="VkIdSdkOneTap"
            style={
                isLoading
                    ? { pointerEvents: "none", opacity: 0.65 }
                    : undefined
            }
        />
    );
}
