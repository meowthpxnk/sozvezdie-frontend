const DEFAULT_API_URL = "https://constellationshop.ru/api";
const DEFAULT_MEDIA_URL = "https://constellationshop.ru/minio";

function readPublicEnv(name: string, fallback: string): string {
    const value = process.env[name]?.trim();
    return value || fallback;
}

/** Backend API base URL (browser-accessible). */
export const API_URL = readPublicEnv("NEXT_PUBLIC_API_URL", DEFAULT_API_URL);

/** MinIO / media server base URL (browser-accessible). */
export const MEDIA_URL = readPublicEnv("NEXT_PUBLIC_MEDIA_URL", DEFAULT_MEDIA_URL);

/** Full public URL to the images bucket, e.g. http://localhost:4003/images-bucket */
export const MEDIA_BUCKET_URL = readPublicEnv(
    "NEXT_PUBLIC_MEDIA_BUCKET_URL",
    `${MEDIA_URL}/images-bucket`,
);

export const VKID_APP_ID = Number(
    readPublicEnv("NEXT_PUBLIC_VKID_APP_ID", "54614063"),
);

export const VKID_REDIRECT_URL = readPublicEnv(
    "NEXT_PUBLIC_VKID_REDIRECT_URL",
    "https://soz-front.meowthland.ru",
);
