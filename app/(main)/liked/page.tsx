import { VideoRow } from "@/components/video-row";
import { getLikedVideos } from "@/lib/api";

export const metadata = { title: "Liked videos · CloudTube" };

export default async function LikedVideosPage() {
    const videos = await getLikedVideos();

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Liked videos</h1>
                <p className="text-sm text-muted-foreground">
                    {videos.length} {videos.length === 1 ? "video" : "videos"}
                </p>
            </div>

            {videos.length === 0 ? (
                <p className="py-20 text-center text-sm text-muted-foreground">
                    Videos you like will show up here.
                </p>
            ) : (
                <div className="space-y-4">
                    {videos.map((video) => (
                        <VideoRow key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}
