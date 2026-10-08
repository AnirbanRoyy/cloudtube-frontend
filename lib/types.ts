export type Channel = {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
    subscribers: number;
};

export type Video = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoFile: string;
    /** seconds; not stored by the backend yet */
    duration: number;
    views: number;
    isPublished: boolean;
    createdAt: string;
    owner: Channel;
};

export type HistoryEntry = {
    video: Video;
    watchedAt: string;
};

export type ChannelStats = {
    totalViews: number;
    subscribers: number;
    totalVideos: number;
    totalLikes: number;
};
