import Image from "next/image";
import Link from "next/link";

import { formatDuration, formatViews, timeAgo } from "@/lib/format";
import type { Video } from "@/lib/types";

/** Horizontal video layout used by list pages (history, liked videos). */
export function VideoRow({ video }: Readonly<{ video: Video }>) {
    return (
        <div className="flex gap-4">
            <Link
                href={`/watch/${video.id}`}
                className="group relative block aspect-video w-40 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-60"
            >
                <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(min-width: 640px) 240px, 160px"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <span className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                    {formatDuration(video.duration)}
                </span>
            </Link>

            <div className="min-w-0 py-0.5">
                <Link href={`/watch/${video.id}`}>
                    <h3 className="line-clamp-2 text-sm leading-snug font-medium sm:text-base">
                        {video.title}
                    </h3>
                </Link>
                <Link
                    href={`/channel/${video.owner.username}`}
                    className="mt-1 block truncate text-xs text-muted-foreground hover:text-foreground"
                >
                    {video.owner.username}
                </Link>
                <p className="text-xs text-muted-foreground">
                    {formatViews(video.views)} · {timeAgo(video.createdAt)}
                </p>
                <p className="mt-2 line-clamp-2 hidden text-xs text-muted-foreground sm:block">
                    {video.description}
                </p>
            </div>
        </div>
    );
}
