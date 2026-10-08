import {
    currentChannel,
    likedVideos,
    subscribedChannels,
    videos,
    watchHistory,
} from "@/lib/mock-data";
import type { Channel, ChannelStats, HistoryEntry, Video } from "@/lib/types";

// Mock data layer. Signatures mirror the future /api/v1 calls so pages
// don't change when this is swapped for real fetches.

export async function getVideos(): Promise<Video[]> {
    return videos.filter((v) => v.isPublished);
}

export async function getVideo(id: string): Promise<Video | null> {
    return videos.find((v) => v.id === id) ?? null;
}

export async function getMyVideos(): Promise<Video[]> {
    return videos.filter((v) => v.owner.id === currentChannel.id);
}

export async function getChannelStats(): Promise<ChannelStats> {
    const mine = await getMyVideos();
    return {
        totalViews: mine.reduce((sum, v) => sum + v.views, 0),
        subscribers: currentChannel.subscribers,
        totalVideos: mine.length,
        totalLikes: 18_240,
    };
}

export async function getCurrentUser() {
    return currentChannel;
}

export async function getSubscribedChannels(): Promise<Channel[]> {
    return subscribedChannels;
}

/** Published videos from subscribed channels, newest first. */
export async function getSubscriptionFeed(): Promise<Video[]> {
    const ids = new Set(subscribedChannels.map((c) => c.id));
    return videos
        .filter((v) => v.isPublished && ids.has(v.owner.id))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getWatchHistory(): Promise<HistoryEntry[]> {
    return watchHistory;
}

export async function getLikedVideos(): Promise<Video[]> {
    return likedVideos;
}
