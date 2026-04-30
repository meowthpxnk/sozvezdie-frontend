"use client";

import { useMemo } from "react";
import { AdminShell } from "@/src/main_pages/admin-shell";
import { AdminProductCreatePage } from "@/src/main_pages/admin-product-create-page";
import { useSellerData } from "@/src/shared/lib/use-seller-data";

export const AdminProductEditPage = ({ productId }: { productId: string }) => {
    const { snapshot, updateProduct } = useSellerData();
    const selectedProduct = snapshot?.products.find((item) => item.id === productId);
    const initialForm = useMemo(() => {
        if (!selectedProduct) {
            return undefined;
        }
        return {
            name: selectedProduct.name,
            description: selectedProduct.description,
            price: String(selectedProduct.price),
            images: selectedProduct.images,
            coverImageId: selectedProduct.coverImageId,
        };
    }, [selectedProduct]);

    if (!selectedProduct || !initialForm) {
        return <AdminShell title="Редактирование товара">Загрузка...</AdminShell>;
    }

    return (
        <AdminProductCreatePage
            initialForm={initialForm}
            shellTitle="Редактирование товара"
            formTitle="Форма редактирования товара"
            formDescription="Обновите карточку товара. После сохранения изменения снова отправятся на модерацию."
            submitLabel="Сохранить товар"
            onSubmitForm={async (form) => {
                await updateProduct({
                    id: productId,
                    name: form.name.trim(),
                    description: form.description.trim(),
                    price: Number(form.price),
                    stockCount: selectedProduct.stockCount,
                    images: form.images,
                    coverImageId: form.coverImageId,
                });
            }}
        />
    );
};

