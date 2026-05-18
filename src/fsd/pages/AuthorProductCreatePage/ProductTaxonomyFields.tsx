"use client";

import styled from "styled-components";

import { useProductTaxonomy } from "./useProductTaxonomy";
import { TaxonomySuggestInput } from "./TaxonomySuggestInput";

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const FieldLabel = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: #2d3a54;
`;

const SelectInput = styled.select`
    width: 100%;
    min-height: 42px;
    border-radius: 8px;
    border: 1px solid #e6e6e6;
    padding: 10px 12px;
    font-size: 14px;
    color: #000;
    background: #fff;
    cursor: pointer;

    &:focus {
        outline: 2px solid #4f83e3;
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

type ProductTaxonomyFieldsProps = {
    categorySlug: string;
    subcategorySlug: string;
    subcategoryLabel: string;
    fandomSlug: string;
    fandomLabel: string;
    onCategoryChange: (slug: string) => void;
    onSubcategoryChange: (label: string, slug: string) => void;
    onFandomChange: (label: string, slug: string) => void;
};

export function ProductTaxonomyFields({
    categorySlug,
    subcategorySlug,
    subcategoryLabel,
    fandomSlug,
    fandomLabel,
    onCategoryChange,
    onSubcategoryChange,
    onFandomChange,
}: ProductTaxonomyFieldsProps) {
    const { categories, subcategories, fandoms, loading, subcategoriesLoading } =
        useProductTaxonomy(categorySlug);

    return (
        <>
            <FieldGroup>
                <FieldLabel htmlFor="product-category">Категория</FieldLabel>
                <SelectInput
                    id="product-category"
                    value={categorySlug}
                    disabled={loading}
                    onChange={(event) => onCategoryChange(event.target.value)}
                >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                            {category.title}
                        </option>
                    ))}
                </SelectInput>
            </FieldGroup>

            {categorySlug ? (
                <TaxonomySuggestInput
                    id="product-subcategory"
                    label="Подкатегория"
                    labelText={subcategoryLabel}
                    slug={subcategorySlug}
                    options={subcategories}
                    placeholder="Введите или выберите подкатегорию"
                    disabled={subcategoriesLoading}
                    emptyHint="Подкатегорий пока нет — введите своё название"
                    onChange={onSubcategoryChange}
                />
            ) : null}

            <TaxonomySuggestInput
                id="product-fandom"
                label="Фандом"
                labelText={fandomLabel}
                slug={fandomSlug}
                options={fandoms}
                placeholder="Введите или выберите фандом"
                disabled={loading}
                emptyHint="Фандомов пока нет — введите своё название"
                onChange={onFandomChange}
            />
        </>
    );
}
