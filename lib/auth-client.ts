"use client";

// Browser-side auth calls. Requests go to /api/v1 on the Next origin, which
// next.config.ts rewrites to the Express backend, so cookies stay same-origin.

export const LIVE = process.env.NEXT_PUBLIC_API_MODE === "live";

async function send(path: string, init: RequestInit) {
    const res = await fetch(`/api/v1${path}`, {
        credentials: "include",
        ...init,
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(body?.message ?? `Request failed (${res.status})`);
    }
    return body?.data;
}

export function login(identifier: string, password: string) {
    // The backend takes `email` or `username`; send whichever this looks like.
    const key = identifier.includes("@") ? "email" : "username";
    return send("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: identifier, password }),
    });
}

/** `form` carries fullName, username, email, password, avatar, coverImage. */
export function register(form: FormData) {
    return send("/users", { method: "POST", body: form });
}

export function logout() {
    return send("/users/logout", { method: "POST" });
}
