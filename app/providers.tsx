"use client";

import { PropsWithChildren } from "react";

import { ReduxProvider } from "@/src/providers/redux-provider";
import { QueryProvider } from "@/src/providers/query-provider";
import { ToastProvider } from "@/src/providers/toast-provider";

export function Providers({ children }: PropsWithChildren) {
    return (
        <ReduxProvider>
            <QueryProvider>
                {children}
                <ToastProvider />
            </QueryProvider>
        </ReduxProvider>
    );
}
