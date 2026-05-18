"use client";

import { useQuery } from "@tanstack/react-query";

import authorService from "@entities/author/author.service";

export function useAuthorProducts() {
    const query = useQuery({
        queryKey: ["author", "products"],
        queryFn: () => authorService.getMyProducts(),
    });

    return {
        products: query.data ?? [],
        loading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}
