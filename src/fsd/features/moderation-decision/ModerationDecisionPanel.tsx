"use client";

import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

import { useModerationDecide } from "./useModerationDecide";

const Panel = styled.section`
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 8px 24px rgba(17, 31, 60, 0.05);
`;

const PanelTitle = styled.h3`
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #132647;
`;

const CommentField = styled.textarea`
    min-height: 88px;
    border-radius: 10px;
    border: 1px solid #d7ddea;
    padding: 10px 12px;
    font-size: 14px;
    resize: vertical;
    color: #132647;

    &:focus {
        outline: 2px solid var(--main-color);
        outline-offset: 1px;
    }
`;

const Actions = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const RejectButton = styled.button`
    flex: 1;
    min-width: 140px;
    min-height: 42px;
    border: none;
    border-radius: 10px;
    background: #fff1f0;
    color: #c0392b;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ApproveButton = styled.button`
    flex: 1;
    min-width: 140px;
    min-height: 42px;
    border: none;
    border-radius: 10px;
    background: var(--main-color);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

type ModerationDecisionPanelProps = {
    proposalId: string;
    onBeforeApprove?: () => Promise<boolean | void>;
    approveLabel?: string;
    rejectLabel?: string;
    approvePendingLabel?: string;
};

export function ModerationDecisionPanel({
    proposalId,
    onBeforeApprove,
    approveLabel = "Принять",
    rejectLabel = "Отклонить",
    approvePendingLabel = "Принимаем...",
}: ModerationDecisionPanelProps) {
    const router = useRouter();
    const { deciding, decide } = useModerationDecide();
    const [comment, setComment] = useState("");

    const handleDecision = async (status: "APPROVED" | "REJECTED") => {
        if (status === "APPROVED" && onBeforeApprove) {
            try {
                const canProceed = await onBeforeApprove();
                if (canProceed === false) {
                    return;
                }
            } catch {
                return;
            }
        }

        const success = await decide(proposalId, status, comment.trim() || undefined);
        if (success) {
            router.replace("/moderation");
        }
    };

    return (
        <Panel>
            <PanelTitle>Решение по заявке</PanelTitle>
            <CommentField
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Комментарий для автора (необязателен при принятии)"
            />
            <Actions>
                <RejectButton
                    type="button"
                    disabled={deciding}
                    onClick={() => void handleDecision("REJECTED")}
                >
                    {rejectLabel}
                </RejectButton>
                <ApproveButton
                    type="button"
                    disabled={deciding}
                    onClick={() => void handleDecision("APPROVED")}
                >
                    {deciding ? approvePendingLabel : approveLabel}
                </ApproveButton>
            </Actions>
        </Panel>
    );
}
