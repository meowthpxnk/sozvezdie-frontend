import { AuthorPage } from "@/src/main_pages/author-page";

type AuthorRouteProps = {
    params: Promise<{ id: string }>;
};

export default async function AuthorRoute({ params }: AuthorRouteProps) {
    const { id } = await params;

    return <AuthorPage authorId={id} />;
}
