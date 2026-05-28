"use client";

import { useEffect, useRef } from "react";

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

type VkIdOneTapProps = {
    onVkAuth: (vkAccessToken: string) => Promise<void>;
    disabled?: boolean;
    onError?: (error: unknown) => void;
};

export function VkIdOneTap({
    onVkAuth,
    disabled = false,
    onError,
}: VkIdOneTapProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const onVkAuthRef = useRef(onVkAuth);
    const onErrorRef = useRef(onError);

    onVkAuthRef.current = onVkAuth;
    onErrorRef.current = onError;

    useEffect(() => {
        if (!containerRef.current || disabled) return;

        Config.init({
            app: VKID_APP_ID,
            redirectUrl: VKID_REDIRECT_URL,
            responseMode: ConfigResponseMode.Callback,
            source: ConfigSource.LOWCODE,
            scope: "",
        });

        const oneTap = new OneTap();

        const handleError = (error: unknown) => {
            onErrorRef.current?.(error);
        };

        oneTap
            .render({
                container: containerRef.current,
                fastAuthEnabled: false,
            })
            .on(WidgetEvents.ERROR, handleError)
            .on(OneTapInternalEvents.LOGIN_SUCCESS, async (payload: { code: string; device_id: string }) => {
                try {
                    const response = await Auth.exchangeCode(
                        payload.code,
                        payload.device_id
                    );

                    await onVkAuthRef.current(response.access_token);
                } catch (error) {
                    handleError(error);
                }
            });

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, [disabled]);

    return (
        <div
            ref={containerRef}
            id="VkIdSdkOneTap"
            style={disabled ? { pointerEvents: "none", opacity: 0.65 } : undefined}
        />
    );
}
