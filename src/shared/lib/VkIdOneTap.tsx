"use client";

import { useEffect, useRef, useState } from "react";

import {
    Auth,
    Config,
    ConfigResponseMode,
    ConfigSource,
    OneTap,
    OneTapInternalEvents,
    WidgetEvents,
} from "@vkid/sdk";

import { VKID_APP_ID, VKID_REDIRECT_URL } from "@shared/config/public-env";

type VkLoginPayload = {
    code: string;
    device_id: string;
};

type VkIdOneTapProps = {
    onVkAuth: (vkAccessToken: string) => Promise<void>;
    onError?: (error: unknown) => void;
};

export function VkIdOneTap({ onVkAuth, onError }: VkIdOneTapProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
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
            .on(OneTapInternalEvents.LOGIN_SUCCESS, async (payload: VkLoginPayload) => {
                if (isLoadingRef.current) return;

                isLoadingRef.current = true;
                setIsLoading(true);

                try {
                    const tokens = await Auth.exchangeCode(
                        payload.code,
                        payload.device_id
                    );

                    const vkAccessToken = tokens.access_token?.trim();
                    if (!vkAccessToken) {
                        throw new Error("VK не вернул access_token");
                    }

                    await onVkAuthRef.current(vkAccessToken);
                } catch (error) {
                    onErrorRef.current?.(error);
                } finally {
                    isLoadingRef.current = false;
                    setIsLoading(false);
                }
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
