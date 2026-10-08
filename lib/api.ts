import { redirect } from "next/navigation";

import { ApiRequestError, apiGet, apiPost } from "@/lib/http";
import {
    currentChannel,
    likedVideos,
    subscribedChannels,
    videos,
    watchHistory,
} from "@/lib/mock-data";
import {
    toChannel,
    toHistoryEntry,
    toVideo,
    type ApiUser,
    type ApiVideo,
} from "@/lib/normalize";
import type { Channel, ChannelStats, HistoryEntry, Video } from "@/lib/types";

// Data layer. NEXT_PUBLIC_API_MODE=live talks to the Express backend
// (/api/v1); anything else serves lib/mock-data.ts. Signatures are the same
// in both modes, so pages don't care. Endpoints the backend doesn't have yet
// (likes, stats, duration) stay mocked or zeroed, marked below.

const LIVE = process.env.NEXT_PUBLIC_API_MODE === "live";

type Page<T> = { docs: T[] };

/** The backend answers 401 (or 500, see backend CLAUDE.md) for a bad session. */
function isAuthFailure(err: unknown) {
    return (
        err instanceof ApiRequestError &&
        (err.status === 401 || err.status === 500)
    );
}

export async function getVideos(): Promise<Video[]> {
    if (!LIVE) return videos.filter((v) => v.isPublished);
    const page = await apiGet<Page<ApiVideo>>("/videos?limit=24");
    return page.docs.map(toVideo);
}

export async function getVideo(id: string): Promise<Video | null> {
    if (!LIVE) return videos.find((v) => v.id === id) ?? null;
    try {
        const video = await apiGet<ApiVideo | undefined>(`/videos/${id}`);
        return video ? toVideo(video) : null;
    } catch (err) {
        if (
            err instanceof ApiRequestError &&
            (err.status === 404 || err.status === 400)
        ) {
            return null;
        }
        throw err;
    }
}

export async function getMyVideos(): Promise<Video[]> {
    if (!LIVE) return videos.filter((v) => v.owner.id === currentChannel.id);
    // TODO: backend reads this via POST; switch to GET when it is fixed.
    const page = await apiPost<Page<ApiVideo>>(
        "/videos/get-self-videos?limit=50"
    );
    return page.docs.map(toVideo);
}

export async function getChannelStats(): Promise<ChannelStats> {
    const [mine, user] = await Promise.all([getMyVideos(), getCurrentUser()]);
    return {
        totalViews: mine.reduce((sum, v) => sum + v.views, 0),
        subscribers: user?.subscribers ?? 0,
        totalVideos: mine.length,
        // TODO: no likes API on the backend yet.
        totalLikes: LIVE ? 0 : 18_240,
    };
}

/** The signed-in user as a channel, or null when signed out. */
export async function getCurrentUser(): Promise<Channel | null> {
    if (!LIVE) return currentChannel;
    try {
        // TODO: POST-only on the backend today.
        const me = await apiPost<ApiUser>("/users/get-current-user");
        // The profile aggregate carries the subscriber count.
        const profile = await apiPost<ApiUser>(
            `/users/get-user-profile/${me.username}`
        ).catch(() => me);
        return toChannel(profile);
    } catch (err) {
        if (isAuthFailure(err)) return null;
        throw err;
    }
}

/** Like getCurrentUser, but sends signed-out visitors to /login. */
export async function requireUser(): Promise<Channel> {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return user;
}

export async function getSubscribedChannels(): Promise<Channel[]> {
    if (!LIVE) return subscribedChannels;
    const user = await requireUser();
    const channels = await apiGet<ApiUser[]>(
        `/subscriptions/get-subscribed-channels/${user.id}`
    );
    return channels.map(toChannel);
}

/** Published videos from subscribed channels, newest first. */
export async function getSubscriptionFeed(): Promise<Video[]> {
    if (!LIVE) {
        const ids = new Set(subscribedChannels.map((c) => c.id));
        return videos
            .filter((v) => v.isPublished && ids.has(v.owner.id))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    // No per-channel video endpoint yet: filter the latest page client-side.
    const [channels, all] = await Promise.all([
        getSubscribedChannels(),
        getVideos(),
    ]);
    const ids = new Set(channels.map((c) => c.id));
    return all
        .filter((v) => ids.has(v.owner.id))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getWatchHistory(): Promise<HistoryEntry[]> {
    if (!LIVE) return watchHistory;
    await requireUser();
    // TODO: POST-only on the backend today.
    const list = await apiPost<ApiVideo[]>("/users/get-watch-history");
    return list.map(toHistoryEntry);
}

// TODO: backend has a Like model but no API, so this is mocked in both modes.
export async function getLikedVideos(): Promise<Video[]> {
    return likedVideos;
}
