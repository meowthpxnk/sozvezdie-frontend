import { API_URL } from "@shared/config/public-env";

type NamedEntityMeta = {
    name: string;
};

async function fetchNamedEntity(path: string): Promise<NamedEntityMeta | null> {
    try {
        const response = await fetch(`${API_URL}${path}`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            return null;
        }

        const data = (await response.json()) as { name?: string };

        if (!data.name?.trim()) {
            return null;
        }

        return { name: data.name.trim() };
    } catch {
        return null;
    }
}

export async function fetchProductMeta(id: string): Promise<NamedEntityMeta | null> {
    return fetchNamedEntity(`/product/${id}`);
}

export async function fetchAuthorMeta(id: string): Promise<NamedEntityMeta | null> {
    return fetchNamedEntity(`/author/${id}`);
}
