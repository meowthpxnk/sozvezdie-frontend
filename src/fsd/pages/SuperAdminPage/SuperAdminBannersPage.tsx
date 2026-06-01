"use client";

import { useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { superAdminService } from "@entities/super-admin";
import { MEDIA_URL } from "@shared/api/interceptors";
import { SetAdminChrome } from "@widgets/AdminShell";

const Card = styled.section`
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 8px 24px rgba(17, 31, 60, 0.05);
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Field = styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #2d3a54;
`;

const Input = styled.input`
    min-height: 40px;
    border-radius: 8px;
    border: 1px solid #d7ddea;
    padding: 0 12px;
    font-size: 14px;
    color: #132647;
`;

const Textarea = styled.textarea`
    min-height: 72px;
    border-radius: 8px;
    border: 1px solid #d7ddea;
    padding: 10px 12px;
    font-size: 14px;
    color: #132647;
    resize: vertical;
`;

const PrimaryButton = styled.button`
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

const DangerButton = styled.button`
    min-height: 38px;
    border: none;
    border-radius: 8px;
    background: #fff1f0;
    color: #c0392b;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
`;

const BannerItem = styled.article`
    display: grid;
    gap: 12px;
    padding-top: 16px;
    margin-top: 16px;
    border-top: 1px solid #eef1f6;

    @media (min-width: 720px) {
        grid-template-columns: 180px 1fr;
        align-items: start;
    }
`;

const Preview = styled.img`
    width: 100%;
    max-width: 180px;
    aspect-ratio: 16 / 6;
    object-fit: cover;
    border-radius: 10px;
    background: #eef1f6;
`;

const Actions = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const EmptyState = styled.p`
    margin: 0;
    font-size: 14px;
    color: #6b7890;
`;

const BannerForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

type BannerFormState = {
    link: string;
    text: string;
    image: File | null;
};

const emptyForm = (): BannerFormState => ({
    link: "",
    text: "",
    image: null,
});

export function SuperAdminBannersPage() {
    const queryClient = useQueryClient();
    const [createForm, setCreateForm] = useState<BannerFormState>(emptyForm);
    const [editForms, setEditForms] = useState<Record<number, BannerFormState>>({});

    const bannersQuery = useQuery({
        queryKey: ["super-admin", "banners"],
        queryFn: () => superAdminService.getBanners(),
    });

    const invalidate = async () => {
        await queryClient.invalidateQueries({ queryKey: ["super-admin", "banners"] });
        await queryClient.invalidateQueries({ queryKey: ["advertBanners"] });
    };

    const createMutation = useMutation({
        mutationFn: () => {
            if (!createForm.image) {
                throw new Error("Выберите изображение");
            }

            return superAdminService.createBanner({
                image: createForm.image,
                link: createForm.link.trim(),
                text: createForm.text.trim(),
            });
        },
        onSuccess: async () => {
            setCreateForm(emptyForm());
            await invalidate();
            toast.success("Баннер добавлен");
        },
        onError: () => toast.error("Не удалось добавить баннер"),
    });

    const updateMutation = useMutation({
        mutationFn: (bannerId: number) => {
            const form = editForms[bannerId];
            if (!form) {
                throw new Error("Форма не найдена");
            }

            return superAdminService.updateBanner(bannerId, {
                link: form.link.trim(),
                text: form.text.trim(),
                image: form.image,
            });
        },
        onSuccess: async () => {
            await invalidate();
            toast.success("Баннер обновлён");
        },
        onError: () => toast.error("Не удалось обновить баннер"),
    });

    const deleteMutation = useMutation({
        mutationFn: (bannerId: number) => superAdminService.deleteBanner(bannerId),
        onSuccess: async () => {
            await invalidate();
            toast.success("Баннер удалён");
        },
        onError: () => toast.error("Не удалось удалить баннер"),
    });

    const banners = bannersQuery.data ?? [];

    return (
        <>
            <SetAdminChrome title="Баннеры лендинга" />
            <Card>
                <Field>
                    Новый баннер — ссылка
                    <Input
                        value={createForm.link}
                        onChange={(event) =>
                            setCreateForm((prev) => ({ ...prev, link: event.target.value }))
                        }
                        placeholder="https://..."
                    />
                </Field>
                <Field>
                    Заголовок
                    <Textarea
                        value={createForm.text}
                        onChange={(event) =>
                            setCreateForm((prev) => ({ ...prev, text: event.target.value }))
                        }
                    />
                </Field>
                <Field>
                    Изображение
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                            setCreateForm((prev) => ({
                                ...prev,
                                image: event.target.files?.[0] ?? null,
                            }))
                        }
                    />
                </Field>
                <PrimaryButton
                    type="button"
                    disabled={createMutation.isPending}
                    onClick={() => createMutation.mutate()}
                >
                    Добавить баннер
                </PrimaryButton>
            </Card>

            <Card>
                {bannersQuery.isLoading ? <EmptyState>Загрузка баннеров…</EmptyState> : null}
                {banners.length === 0 && !bannersQuery.isLoading ? (
                    <EmptyState>Баннеров пока нет.</EmptyState>
                ) : null}
                {banners.map((banner) => {
                    const form = editForms[banner.id] ?? {
                        link: banner.href,
                        text: banner.title,
                        image: null,
                    };

                    return (
                        <BannerItem key={banner.id}>
                            <Preview
                                src={`${MEDIA_URL}/images-bucket/${banner.image}`}
                                alt=""
                            />
                            <BannerForm
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    updateMutation.mutate(banner.id);
                                }}
                            >
                                <Field>
                                    Ссылка
                                    <Input
                                        value={form.link}
                                        onChange={(event) =>
                                            setEditForms((prev) => ({
                                                ...prev,
                                                [banner.id]: {
                                                    ...form,
                                                    link: event.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    Заголовок
                                    <Textarea
                                        value={form.text}
                                        onChange={(event) =>
                                            setEditForms((prev) => ({
                                                ...prev,
                                                [banner.id]: {
                                                    ...form,
                                                    text: event.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    Новое изображение (необязательно)
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) =>
                                            setEditForms((prev) => ({
                                                ...prev,
                                                [banner.id]: {
                                                    ...form,
                                                    image: event.target.files?.[0] ?? null,
                                                },
                                            }))
                                        }
                                    />
                                </Field>
                                <Actions>
                                    <PrimaryButton
                                        type="button"
                                        disabled={updateMutation.isPending}
                                        onClick={() => updateMutation.mutate(banner.id)}
                                    >
                                        Сохранить
                                    </PrimaryButton>
                                    <DangerButton
                                        type="button"
                                        disabled={deleteMutation.isPending}
                                        onClick={() => deleteMutation.mutate(banner.id)}
                                    >
                                        Удалить
                                    </DangerButton>
                                </Actions>
                            </BannerForm>
                        </BannerItem>
                    );
                })}
            </Card>
        </>
    );
}
