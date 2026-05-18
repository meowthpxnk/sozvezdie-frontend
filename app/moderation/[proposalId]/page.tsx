import {
    ModeratorBrandEditPage,
    ModeratorProductEditPage,
} from "@/src/fsd/pages/ModerationEditPage";
import { SetAdminChrome } from "@widgets/AdminShell";

type ModerationEditRouteProps = {
    params: Promise<{ proposalId: string }>;
};

export default async function ModerationEditRoute({ params }: ModerationEditRouteProps) {
    const { proposalId } = await params;

    if (proposalId.startsWith("brand-")) {
        return <ModeratorBrandEditPage proposalId={proposalId} />;
    }

    if (proposalId.startsWith("product-")) {
        return <ModeratorProductEditPage proposalId={proposalId} />;
    }

    return (
        <>
            <SetAdminChrome title="Модерация" />
            <p>Некорректный идентификатор заявки.</p>
        </>
    );
}
