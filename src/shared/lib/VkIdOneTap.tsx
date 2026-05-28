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

export function VkIdOneTap() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        Config.init({
            app: Number(54614063),
            redirectUrl: "https://constellationshop.ru",
            responseMode: ConfigResponseMode.Callback,
            source: ConfigSource.LOWCODE,
            scope: "",
        });

        const oneTap = new OneTap();

        const onSuccess = async (data: unknown) => {
            console.log("VK Auth success:", data);
        };

        const onError = (error: unknown) => {
            console.error("VK Auth error:", error);
        };

        oneTap
            .render({
                container: containerRef.current,
                fastAuthEnabled: false,
            })
            .on(WidgetEvents.ERROR, onError)
            .on(
                OneTapInternalEvents.LOGIN_SUCCESS,
                async (payload) => {
                    try {
                        const code = payload.code;
                        const deviceId = payload.device_id;

                        const response = await Auth.exchangeCode(
                            code,
                            deviceId
                        );

                        await onSuccess(response);
                    } catch (error) {
                        onError(error);
                    }
                }
            );

        return () => {
            /**
             * cleanup
             * чтобы не было дублей при remount
             */
            containerRef.current!.innerHTML = "";
        };
    }, []);

    return <div ref={containerRef} id="VkIdSdkOneTap" />;
}
