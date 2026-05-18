export interface Subcategory {
    slug: string;
    title: string;
    categorySlug: string;
    authorId: string;
}

export interface SubcategoryCreatePayload {
    title: string;
    slug: string;
}
