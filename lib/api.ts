import { currentChannel, videos } from "@/lib/mock-data";
import type { ChannelStats, Video } from "@/lib/types";

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
