const DEFAULT_API_URL = "http://localhost:2000";
const DEFAULT_MEDIA_URL = "http://localhost:4003";

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
