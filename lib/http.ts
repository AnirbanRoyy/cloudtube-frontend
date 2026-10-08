import { cookies } from "next/headers";

// Server-side fetch to the Express API. Forwards the browser's cookies so
// verifyJWT sees the session. Client components go through the /api/v1
// rewrite in next.config.ts instead (see lib/auth-client.ts).

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export class ApiRequestError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message);
    }
}

type Envelope<T> = { statusCode: number; data: T; message: string };

export async function apiGet<T>(path: string): Promise<T> {
    return apiRequest<T>(path, { method: "GET" });
}

/** For endpoints that are still POST-only on the backend. */
export async function apiPost<T>(path: string): Promise<T> {
    return apiRequest<T>(path, { method: "POST" });
}

async function apiRequest<T>(path: string, init: RequestInit): Promise<T> {
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${BACKEND_URL}/api/v1${path}`, {
        ...init,
        headers: { cookie: cookieHeader },
        cache: "no-store",
    });
    const body = (await res.json().catch(() => null)) as Envelope<T> | null;
    if (!res.ok) {
        throw new ApiRequestError(
            res.status,
            body?.message ?? `Request failed (${res.status})`
        );
    }
    return body!.data;
}
