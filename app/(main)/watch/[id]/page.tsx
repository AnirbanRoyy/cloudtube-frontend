import { notFound } from "next/navigation";

import { UserAvatar } from "@/components/user-avatar";
import { getVideo } from "@/lib/api";
import { formatCount, formatViews, timeAgo } from "@/lib/format";

export default async function WatchPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const video = await getVideo(id);
    if (!video) notFound();

    return (
        <div className="mx-auto max-w-4xl space-y-4">
            <video
                src={video.videoFile}
                poster={video.thumbnail}
                controls
                className="aspect-video w-full rounded-xl bg-black"
            />
            <h1 className="text-xl font-semibold">{video.title}</h1>
            <div className="flex items-center gap-3">
                <UserAvatar
                    src={video.owner.avatar}
                    name={video.owner.fullName}
                    size="lg"
                />
                <div>
                    <p className="text-sm font-medium">
                        {video.owner.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatCount(video.owner.subscribers)} subscribers
                    </p>
                </div>
            </div>
            <div className="rounded-xl bg-muted p-3 text-sm">
                <p className="font-medium">
                    {formatViews(video.views)} · {timeAgo(video.createdAt)}
                </p>
                <p className="mt-1">{video.description}</p>
            </div>
        </div>
    );
}
