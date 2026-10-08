import { VideoCard } from "@/components/video-card";
import type { Video } from "@/lib/types";

export function VideoGrid({ videos }: { videos: Video[] }) {
    if (videos.length === 0) {
        return (
            <p className="py-20 text-center text-sm text-muted-foreground">
                No videos yet.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}
