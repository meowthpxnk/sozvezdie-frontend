import type { Metadata } from "next";
import { AuthPage } from "@/src/main_pages/auth-page";

export const metadata: Metadata = {
    title: "Вход",
};

export default function AuthRoute() {
    return <AuthPage />;
}
