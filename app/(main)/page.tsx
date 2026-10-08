import { VideoGrid } from "@/components/video-grid";
import { getVideos } from "@/lib/api";

export default async function HomePage() {
    const videos = await getVideos();

    return <VideoGrid videos={videos} />;
}
