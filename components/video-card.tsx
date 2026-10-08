import Image from "next/image";
import Link from "next/link";

import { UserAvatar } from "@/components/user-avatar";
import { Card } from "@/components/ui/card";
import { formatDuration, formatViews, timeAgo } from "@/lib/format";
import type { Video } from "@/lib/types";

export function VideoCard({ video }: Readonly<{ video: Video }>) {
    const { owner } = video;

    return (
        <Card className="gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none ring-0">
            <Link
                href={`/watch/${video.id}`}
                className="group relative block aspect-video overflow-hidden rounded-xl bg-muted"
            >
                <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <span className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                    {formatDuration(video.duration)}
                </span>
            </Link>

            <div className="flex gap-3 pt-3">
                <Link href={`/channel/${owner.username}`} className="shrink-0">
                    <UserAvatar
                        src={owner.avatar}
                        name={owner.fullName}
                        size="lg"
                    />
                </Link>
                <div className="min-w-0">
                    <Link href={`/watch/${video.id}`}>
                        <h3 className="line-clamp-2 text-sm leading-snug font-medium">
                            {video.title}
                        </h3>
                    </Link>
                    <Link
                        href={`/channel/${owner.username}`}
                        className="mt-1 block truncate text-xs text-muted-foreground hover:text-foreground"
                    >
                        {owner.username}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {formatViews(video.views)} · {timeAgo(video.createdAt)}
                    </p>
                </div>
            </div>
        </Card>
    );
}
