"use client";

import { useQuery } from "@tanstack/react-query";

import authorService from "@entities/author/author.service";

export function useAuthorDashboard() {
    const query = useQuery({
        queryKey: ["author", "dashboard"],
        queryFn: () => authorService.getMyDashboard(),
    });

    return {
        dashboard: query.data,
        loading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}
