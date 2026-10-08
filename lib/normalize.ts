import type { Channel, HistoryEntry, Video } from "@/lib/types";

// Backend (Mongoose) shapes -> frontend types. Mongo uses `_id`, the video
// model has no duration, and subscriber counts only exist on the profile
// aggregate, so those default to 0 until the backend provides them.

type ApiUser = {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
    subscribersCount?: number;
};

type ApiVideo = {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoFile: string;
    duration?: number;
    views: number;
    isPublished: boolean;
    createdAt: string;
    owner: ApiUser;
};

export function toChannel(u: ApiUser): Channel {
    return {
        id: u._id,
        username: u.username,
        fullName: u.fullName,
        avatar: u.avatar,
        subscribers: u.subscribersCount ?? 0,
    };
}

export function toVideo(v: ApiVideo): Video {
    return {
        id: v._id,
        title: v.title,
        description: v.description,
        thumbnail: v.thumbnail,
        videoFile: v.videoFile,
        duration: v.duration ?? 0,
        views: v.views,
        isPublished: v.isPublished,
        createdAt: v.createdAt,
        owner: toChannel(v.owner),
    };
}

/**
 * The backend only returns videos in watchHistory order (no timestamp), so
 * `watchedAt` falls back to the video's createdAt until it is stored.
 */
export function toHistoryEntry(v: ApiVideo): HistoryEntry {
    const video = toVideo(v);
    return { video, watchedAt: video.createdAt };
}

export type { ApiUser, ApiVideo };
