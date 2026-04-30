import type { Metadata } from "next";
import { AdminDashboardPage } from "@/src/main_pages/admin-dashboard-page";

export const metadata: Metadata = {
    title: "Seller Admin",
};

export default function AdminRoute() {
    return <AdminDashboardPage />;
}

