"use client";

import { SingleAuthorPage } from "@pages";

type SingleAuthorPageProps = {
    params: Promise<{ id: string }>;
};

export default async function AuthorsRoutePage({ params }: SingleAuthorPageProps) {
    const { id } = await params;
    return <SingleAuthorPage authorId={id} />;
}
