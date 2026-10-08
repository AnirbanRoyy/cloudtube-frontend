import type { Channel, Video } from "@/lib/types";

const channels: Channel[] = [
    {
        id: "c1",
        username: "codewithana",
        fullName: "Ana Torres",
        avatar: "https://i.pravatar.cc/96?img=47",
        subscribers: 128_400,
    },
    {
        id: "c2",
        username: "devdiaries",
        fullName: "Ravi Menon",
        avatar: "https://i.pravatar.cc/96?img=12",
        subscribers: 5_230,
    },
    {
        id: "c3",
        username: "cloudcraft",
        fullName: "Mia Chen",
        avatar: "https://i.pravatar.cc/96?img=32",
        subscribers: 912_000,
    },
    {
        id: "c4",
        username: "pixelpilot",
        fullName: "Leo Fischer",
        avatar: "https://i.pravatar.cc/96?img=15",
        subscribers: 48_700,
    },
];

/** The signed-in user in the mock world. */
export const currentChannel = channels[0];

const titles = [
    "Build a YouTube clone with Next.js 16 from scratch",
    "Understanding HLS adaptive streaming in 10 minutes",
    "Cloud Run vs GKE: which one should you pick?",
    "Resumable uploads to GCS, explained",
    "FFmpeg tricks every backend developer should know",
    "Designing a video processing pipeline with Pub/Sub",
    "Redis caching patterns for feeds",
    "Terraform for beginners: deploy your first service",
    "Why I stopped using useEffect for everything",
    "Mongo aggregations that actually make sense",
    "Load testing with k6: results and bottlenecks",
    "Shipping a side project in a weekend",
];

const HOUR = 3_600_000;
const ages = [2, 20, 70, 200, 500, 900, 2_000, 4_000, 9_000, 15_000, 3, 130];
const views = [
    1_240_000, 8_400, 312_000, 56_000, 970, 2_100_000, 14_300, 402_000, 77,
    640_000, 3_900, 25_000,
];
const durations = [
    1_825, 612, 934, 478, 1_204, 2_710, 355, 1_090, 245, 1_866, 703, 3_605,
];

export const videos: Video[] = titles.map((title, i) => ({
    id: `v${i + 1}`,
    title,
    description: `${title}. A walkthrough covering the concepts, trade-offs and a hands-on demo.`,
    thumbnail: `https://picsum.photos/seed/cloudtube-${i + 1}/640/360`,
    videoFile:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    duration: durations[i],
    views: views[i],
    isPublished: i % 5 !== 4,
    createdAt: new Date(Date.now() - ages[i] * HOUR).toISOString(),
    owner: channels[i % channels.length],
}));
