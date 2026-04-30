import type { Metadata } from "next";
import { Providers } from "./providers";
import { StyledComponentsRegistry } from "@/src/shared/lib/styled-components-registry";
import { PageShell } from "@/src/main_pages/footer";
import "@/src/styles/index.scss";

export const metadata: Metadata = {
    title: "Созвезние | Полки",
    icons: {
        icon: "/favicon.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <StyledComponentsRegistry>
                    <Providers>
                        <PageShell>{children}</PageShell>
                    </Providers>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
